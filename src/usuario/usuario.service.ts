import { Injectable, Req } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { FileService } from 'src/file/file.service';
import { printLog } from 'src/utils/utils';

@Injectable()
export class UsuarioService {
  private message = new Menssage();
  private subPath = 'usuarios';

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private tipoIdentificacion: TipoIdentificacionService,
    private tipoUsuario: TipoUsuarioService,
    private rol: RolService,
    private cargo: CargoService,
    private area: AreaService,
    private file: FileService,
  ) {}

  private readonly customOut = {
    IdUsuario: true,
    Nombres: true,
    ApellidoPaterno: true,
    ApellidoMaterno: true,
    FotoPerfilNombre: true,
    FotoPerfilUrl: true,
    UrlBase: true,
    FechaNacimiento: true,
    CodigoConfirmacion: true,
    Email: true,
    Celular: true,
    Genero: true,
    RazonSocial: true,
    TipoIdentificacion: {
      select: {
        IdTipoIdentificacion: true,
        Descripcion: true,
      },
    },
    NroIdentificacion: true,
    TipoUsuario: {
      select: {
        IdTipoUsuario: true,
        Descripcion: true,
      },
    },
    Rol: {
      select: {
        IdRol: true,
        Descripcion: true,
      },
    },
    Cargo: {
      select: {
        IdCargo: true,
        Descripcion: true,
      },
    },
    Area: {
      select: {
        IdArea: true,
        Descripcion: true,
      },
    },
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createUsuarioDto: CreateUsuarioDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      // validate If user already is registed
      const repeatedUser = await this.findOneByEmail(createUsuarioDto.Email);
      if (repeatedUser.message.msgId !== 2) return repeatedUser;

      let file = null;

      // FileBase64 and NombreImagen always they will send like '', they'll never sends null or undefined
      const fileUpdate =
        (createUsuarioDto.FotoPerfilBase64 || '') != '' &&
        (createUsuarioDto.FotoPerfilNombre || '') != '';

      //we validate FKs
      const idTipoIdentificacion = createUsuarioDto.IdTipoIdentificacion;
      if (idTipoIdentificacion) {
        const idTipoIdentificacionFound =
          await this.tipoIdentificacion.findOne(idTipoIdentificacion);
        if (idTipoIdentificacionFound.message.msgId === 1)
          return idTipoIdentificacionFound;
      }

      const idTipoUsuario = createUsuarioDto.IdTipoUsuario;
      if (idTipoUsuario) {
        const idTipoUsuarioFound =
          await this.tipoUsuario.findOne(idTipoUsuario);
        if (idTipoUsuarioFound.message.msgId === 1) return idTipoUsuarioFound;
      }

      const idArea = createUsuarioDto.IdArea;
      if (idArea) {
        const idAreaFound = await this.area.findOne(idArea);
        if (idAreaFound.message.msgId === 1) return idAreaFound;
      }

      const idRol = createUsuarioDto.IdRol;
      if (idRol) {
        const idRolFound = await this.rol.findOne(idRol);
        if (idRolFound.message.msgId === 1) return idRolFound;
      }

      const idCargo = createUsuarioDto.IdCargo;
      if (idCargo) {
        const idCargoFound = await this.cargo.findOne(idCargo);
        if (idCargoFound.message.msgId === 1) return idCargoFound;
      }

      if (fileUpdate) {
        const pathOrgSaas = this.subPath + '/' + createUsuarioDto.Email;

        file = await this.file.guardarDocumento(
          createUsuarioDto.FotoPerfilBase64,
          pathOrgSaas,
          createUsuarioDto.FotoPerfilNombre,
        );
        // printLog(file);
      }

      // we create new register
      delete createUsuarioDto.FotoPerfilBase64;
      delete createUsuarioDto.FotoPerfilNombre;

      /*
      const idTipoIdentificacionFound = await this.tipoIdentificacion.findOne(
        createUsuarioDto.IdTipoIdentificacion,
      );
      if (idTipoIdentificacionFound.message.msgId === 1) return idTipoIdentificacionFound;

      const idTipoUsuarioFound = await this.tipoUsuario.findOne(
        createUsuarioDto.IdTipoIdentificacion,
      );
      if (idTipoUsuarioFound.message.msgId === 1) return idTipoUsuarioFound;

      const idAreaFound = await this.area.findOne(
        createUsuarioDto.IdArea,
      );
      if (idAreaFound.message.msgId === 1) return idAreaFound;

      const idRolFound = await this.rol.findOne(
        createUsuarioDto.IdRol,
      );
      if (idRolFound.message.msgId === 1) return idRolFound;

      const idCargoFound = await this.cargo.findOne(
        createUsuarioDto.IdCargo,
      );
      if (idCargoFound.message.msgId === 1) return idCargoFound;      
      */
      const usuario = await this.prisma.usuario.create({
        data: fileUpdate
          ? {
              ...createUsuarioDto,
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
              UrlBase: file.UrlBase,
              FotoPerfilUrl: file.Url,
              FotoPerfilNombre: file.Nombre,
            }
          : {
              ...createUsuarioDto,
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
            },
      });

      if (usuario) {
        this.message.setMessage(0, 'Usuario - Registro creado');
        return { message: this.message, registro: usuario };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<any> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const usuarios = await this.prisma.usuario.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (usuarios) {
        this.message.setMessage(0, 'Usuario - Registros encontrados');
        return { message: this.message, registro: usuarios };
      } else {
        this.message.setMessage(1, 'Error: Usuario - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { IdUsuario: id },
        select: this.customOut,
      });

      if (usuario) {
        this.message.setMessage(0, 'Usuario - Registro encontrado');
        return { message: this.message, registro: usuario };
      } else {
        this.message.setMessage(1, 'Error: Usuario - Registro no encontrado');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOneValidate(id: number): Promise<any> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { IdUsuario: id },
        select: { IdUsuario: true },
      });

      if (usuario) {
        this.message.setMessage(0, 'Usuario - Registro encontrado');
        return { message: this.message, registro: usuario };
      } else {
        this.message.setMessage(1, 'Error: Usuario - Registro no encontrado');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    try {
      const usuario = await this.prisma.usuario.findFirst({
        where: { Email: email },
        select: this.customOut,
      });

      if (usuario) {
        this.message.setMessage(0, 'Usuario ya registrado');
        return { message: this.message, registro: usuario };
      } else {
        this.message.setMessage(2, 'Usuario no registrado');
        return { message: this.message, registro: null };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      let file = null;
      let fileUpdate = '';
      const fileUpdateValues = ['R', 'NU', 'U'];
      // FileBase64 and NombreImagen always they will send like '', they'll never sends null or undefined
      const fileB64 =
        updateUsuarioDto.FotoPerfilBase64 === undefined
          ? ''
          : updateUsuarioDto.FotoPerfilBase64;
      const nomImagen =
        updateUsuarioDto.FotoPerfilNombre === undefined
          ? ''
          : updateUsuarioDto.FotoPerfilNombre;

      if (fileB64 == null && nomImagen == null) {
        // remove image
        fileUpdate = fileUpdateValues[0];
      } else if (fileB64 == '' && nomImagen == '') {
        // not update image
        fileUpdate = fileUpdateValues[1];
      } else if (fileB64.length > 0 && nomImagen.length > 0) {
        // update image
        fileUpdate = fileUpdateValues[2];
        if (!(updateUsuarioDto.Email && updateUsuarioDto.Email.length > 0)) {
          this.message.setMessage(
            1,
            'Error: Incorrect parameters, you have to enter Email',
          );
          return { message: this.message };
        }
      } else {
        this.message.setMessage(
          1,
          'Error: Incorrect parameters FotoPerfilBase64 y FotoPerfilNombre',
        );
        return { message: this.message };
      }

      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idTipoIdentificacion = updateUsuarioDto.IdTipoIdentificacion;
      if (idTipoIdentificacion) {
        const idTipoIdentificacionFound =
          await this.tipoIdentificacion.findOne(idTipoIdentificacion);
        if (idTipoIdentificacionFound.message.msgId === 1)
          return idTipoIdentificacionFound;
      }

      const idTipoUsuario = updateUsuarioDto.IdTipoUsuario;
      if (idTipoUsuario) {
        const idTipoUsuarioFound =
          await this.tipoUsuario.findOne(idTipoUsuario);
        if (idTipoUsuarioFound.message.msgId === 1) return idTipoUsuarioFound;
      }

      const idArea = updateUsuarioDto.IdArea;
      if (idArea) {
        const idAreaFound = await this.area.findOne(idArea);
        if (idAreaFound.message.msgId === 1) return idAreaFound;
      }

      const idRol = updateUsuarioDto.IdRol;
      if (idRol) {
        const idRolFound = await this.rol.findOne(idRol);
        if (idRolFound.message.msgId === 1) return idRolFound;
      }

      const idCargo = updateUsuarioDto.IdCargo;
      if (idCargo) {
        const idCargoFound = await this.cargo.findOne(idCargo);
        if (idCargoFound.message.msgId === 1) return idCargoFound;
      }

      if (fileUpdate == fileUpdateValues[2]) {
        const pathOrgSaas = this.subPath + '/' + updateUsuarioDto.Email;

        file = await this.file.guardarDocumento(
          updateUsuarioDto.FotoPerfilBase64,
          pathOrgSaas,
          updateUsuarioDto.FotoPerfilNombre,
        );
        // printLog(file);
      }

      delete updateUsuarioDto.FotoPerfilBase64;
      delete updateUsuarioDto.FotoPerfilNombre;

      const usuario = await this.prisma.usuario.update({
        where: { IdUsuario: id },
        data:
          fileUpdate == fileUpdateValues[0] || fileUpdate == fileUpdateValues[2]
            ? {
                ...updateUsuarioDto,
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
                UrlBase:
                  fileUpdate == fileUpdateValues[0] ? null : file.UrlBase,
                FotoPerfilUrl:
                  fileUpdate == fileUpdateValues[0] ? null : file.Url,
                FotoPerfilNombre:
                  fileUpdate == fileUpdateValues[0] ? null : file.Nombre,
              }
            : {
                ...updateUsuarioDto,
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
              },
      });

      if (usuario) {
        if (
          fileUpdate == fileUpdateValues[0] ||
          fileUpdate == fileUpdateValues[2]
        ) {
          await this.file.eliminarDocumento(
            idFound.registro.UrlBase + '/' + idFound.registro.FotoPerfilNombre,
          );
        }

        this.message.setMessage(0, 'Usuario - Registro actualizado');
        return { message: this.message, registro: usuario };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const usuario = await this.prisma.usuario.delete({
        where: { IdUsuario: id },
      });

      if (usuario) {
        this.file.eliminarDocumento(
          usuario.UrlBase + '/' + usuario.FotoPerfilNombre,
        );

        this.message.setMessage(0, 'Usuario - Registro eliminado');
        return { message: this.message, registro: usuario };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // this code in prisma P2003 verifies referential integrity of FK and PK, we return custom message
        if (error.code === 'P2003') {
          this.message.setMessage(
            1,
            'Oops! No se puede eliminar este registro porque está relacionado con otros datos.',
          );
        }
      } else {
        // whatever other error, we return the error message
        this.message.setMessage(1, error.message);
      }
      console.log(error);
      return { message: this.message };
    }
  }
}
