import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LoginAuthDto, OutLoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { printLog } from 'src/utils/utils';
import moment from 'moment-timezone';
import bcrypt from 'bcryptjs';
import { OutSignupAuthDto, SignupAuthDto } from './dto/signup-auth.dto';
import { MailService } from 'src/mail/mail.service';
import {
  ForgotPasswordAuthDto,
  OutForgotPasswordAuthDto,
} from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { HOUR } from 'src/utils/constants';
import {
  OutVerifyTokenAuthDto,
  VerifyTokenAuthDto,
} from './dto/verify-token-auth.dto';

@Injectable()
export class AuthService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private filtersService: FiltersService,
    private usuario: UsuarioService,
    private configEnv: ConfigService,
    private mail: MailService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<OutLoginAuthDto> {
    try {
      let outLoginAuthRegistro = {
        AccessToken: '',
        AccessTokenTime: '',
        // RefreshToken: refreshToken,
        ExpiresIn: '',
      };

      // validate If user already exist
      const user = await this.prisma.usuario.findFirst({
        where: {
          Email: loginAuthDto.Email,
        },
        select: {
          IdUsuario: true,
          Email: true,
          Contrasena: true,
          Rol: {
            select: {
              IdRol: true,
              Descripcion: true,
            },
          },
        },
      });

      if (!user) {
        this.message.setMessage(2, 'Correo no registrado');
        return {
          message: this.message,
          registro: { ...outLoginAuthRegistro },
        };
      }

      printLog(user);

      // we compare the paswword
      const isPasswordValid =
        // true;
        await bcrypt.compare(loginAuthDto.Contrasena, user.Contrasena);

      if (isPasswordValid) {
        // correct password
        const payload = {
          IdUsuario: user.IdUsuario,
          Email: user.Email,
          IdRol: user.Rol.IdRol,
        };

        const accessToken = this.jwtService.sign(payload, {
          secret: this.configEnv.get('config.keyToken'),
          expiresIn: `${this.configEnv.get('config.timeToken')}`,
        });

        // Decodificar el token para obtener el tiempo de expiración
        const decodedToken = this.jwtService.decode(accessToken) as {
          exp: number;
        };
        const expirationDate = moment.unix(decodedToken.exp).tz('America/Lima');
        const formattedExpiration = expirationDate.format(
          'DD/MM/YYYY HH:mm:ss',
        );

        this.message.setMessage(0, 'Inicio de sesión exitoso');
        outLoginAuthRegistro = {
          AccessToken: accessToken,
          AccessTokenTime: `${this.configEnv.get('config.timeToken')}`,
          // RefreshToken: refreshToken,
          ExpiresIn: formattedExpiration,
        };

        return {
          message: this.message,
          registro: { ...outLoginAuthRegistro },
        };
      } else {
        this.message.setMessage(2, 'Contraseña incorrecta');
        return {
          message: this.message,
          registro: { ...outLoginAuthRegistro },
        };
      }
    } catch (error) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async signup(signupAuthDto: SignupAuthDto): Promise<OutSignupAuthDto> {
    try {
      // we validate the password with confirm password
      const isPasswordValid =
        signupAuthDto.Contrasena === signupAuthDto.ContrasenaConfirmacion;
      if (!isPasswordValid) {
        this.message.setMessage(1, 'Contraseñas no coinciden');
        return {
          message: this.message,
        };
      }

      // validate if user already exist
      const findUser = await this.prisma.usuario.findFirst({
        where: {
          Email: signupAuthDto.Email,
        },
        select: {
          IdUsuario: true,
        },
      });

      if (findUser) {
        this.message.setMessage(1, 'Correo ya registrado');
        return {
          message: this.message,
        };
      }

      // we generate the hash of the password
      const salt = await bcrypt.genSalt(10);
      signupAuthDto.Contrasena = await bcrypt.hash(
        signupAuthDto.Contrasena,
        salt,
      );

      // we create the user
      delete signupAuthDto.ContrasenaConfirmacion;
      const createUser = await this.prisma.usuario.create({
        data: {
          ...signupAuthDto,
          CreadoEl: new Date().toISOString(),
          CreadoPor: `test user`,
          // CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdUsuario: true,
        },
      });

      if (createUser) {
        this.message.setMessage(0, 'Registro de usuario exitoso');
        return { message: this.message, registro: createUser };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async forgotPassword(
    forgotPasswordAuthDto: ForgotPasswordAuthDto,
  ): Promise<OutForgotPasswordAuthDto> {
    try {
      const codigoConfirmacion =
        `${Date.now()}-${crypto.randomUUID()}`.toString();

      const codigoConfirmacionExp = new Date(
        Date.now() + 2 * HOUR,
      ).toISOString();

      // we create the user
      const findUser = await this.prisma.usuario.findFirst({
        where: {
          Email: forgotPasswordAuthDto.Email,
        },
        select: {
          IdUsuario: true,
        },
      });

      if (!findUser) {
        this.message.setMessage(1, 'Correo no registrado');
        return {
          message: this.message,
        };
      }

      const updateUser = await this.prisma.usuario.update({
        where: {
          IdUsuario: findUser.IdUsuario,
        },
        data: {
          CodigoConfirmacion: codigoConfirmacion,
          CodigoConfirmacionExp: codigoConfirmacionExp,
        },
        select: {
          IdUsuario: true,
          Nombres: true,
          ApellidoPaterno: true,
          ApellidoMaterno: true,
          Email: true,
        },
      });

      const mail = await this.mail.sendCodigoConfirmacion({
        Nombres: updateUser.Nombres,
        ApellidoPaterno: updateUser.ApellidoPaterno,
        ApellidoMaterno: updateUser.ApellidoMaterno,
        Email: updateUser.Email,
        UrlResetPassword: `${this.configEnv.get('config.serverDomain')}/reset_password/${codigoConfirmacion}`,
      });

      if (mail.message.msgId == 0) {
        this.message.setMessage(
          0,
          'Se envio un correo para recuperación de contraseña',
        );
        return {
          message: this.message,
          registro: { IdUsuario: updateUser.IdUsuario },
        };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async resetPassword(
    resetPasswordAuthDto: ResetPasswordAuthDto,
  ): Promise<OutSignupAuthDto> {
    try {
      // we validate the password with confirm password
      const isPasswordValid =
        resetPasswordAuthDto.Contrasena ===
        resetPasswordAuthDto.ContrasenaConfirmacion;
      if (!isPasswordValid) {
        this.message.setMessage(1, 'Contraseñas no coinciden');
        return {
          message: this.message,
        };
      }

      // validate if user already exist
      const findUser = await this.prisma.usuario.findFirst({
        where: {
          CodigoConfirmacion: resetPasswordAuthDto.CodigoConfirmacion,
          CodigoConfirmacionExp: {
            gte: new Date().toISOString(),
          },
        },
        select: {
          IdUsuario: true,
        },
      });

      if (!findUser) {
        this.message.setMessage(1, 'Formulario expirado o inválido');
        return {
          message: this.message,
        };
      }

      // we generate the hash of the password
      const salt = await bcrypt.genSalt(10);
      resetPasswordAuthDto.Contrasena = await bcrypt.hash(
        resetPasswordAuthDto.Contrasena,
        salt,
      );

      // we create the user
      const updateUser = await this.prisma.usuario.update({
        where: {
          IdUsuario: findUser.IdUsuario,
        },
        data: {
          Contrasena: resetPasswordAuthDto.Contrasena,
          CodigoConfirmacion: null,
          CodigoConfirmacionExp: null,
          ModificadoEl: new Date().toISOString(),
          ModificadoPor: `test user`,
          // ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdUsuario: true,
        },
      });

      if (updateUser) {
        this.message.setMessage(0, 'Cambio de contraseña exitoso');
        return {
          message: this.message,
          registro: { IdUsuario: updateUser.IdUsuario },
        };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async verifyToken(
    verifyTokenAuthDto: VerifyTokenAuthDto,
  ): Promise<OutVerifyTokenAuthDto> {
    try {
      if (!verifyTokenAuthDto.Token || verifyTokenAuthDto.Token == '') {
        this.message.setMessage(0, 'Token es requerido');
        return { message: this.message };
      }

      // we verify token to get its content
      const decodedToken = this.jwtService.verify(verifyTokenAuthDto.Token, {
        secret: this.configEnv.get('config.keyToken'),
      }) as {
        IdUsuario: number;
        Email: string;
        IdRol: string;
      };

      // we validate data user
      const validateUser = await this.prisma.usuario.findUnique({
        where: { IdUsuario: decodedToken.IdUsuario },
        select: {
          IdUsuario: true,
          Nombres: true,
          ApellidoPaterno: true,
          ApellidoMaterno: true,
          UrlFotoPerfil: true,
          Email: true,
          Rol: {
            select: {
              IdRol: true,
              Descripcion: true,
            },
          },
          Area: {
            select: {
              IdArea: true,
              Descripcion: true,
            },
          },
        },
      });

      if (validateUser) {
        this.message.setMessage(0, 'Usuario verificado');
        return {
          message: this.message,
          registro: validateUser,
        };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        this.message.setMessage(1, 'Token inválido o expirado');
      } else {
        console.log(error);
        this.message.setMessage(1, error.message);
      }
      return { message: this.message };
    }
  }
}
