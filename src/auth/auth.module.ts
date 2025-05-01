import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';
import { MailService } from 'src/mail/mail.service';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.keyToken'),
        // signOptions: { expiresIn: '1h' }, //expiration token: m(minuts), h(hours), d(days)
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UsuarioService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    AreaService,
    MailService,
    Helpers
  ],
})
export class AuthModule {}
