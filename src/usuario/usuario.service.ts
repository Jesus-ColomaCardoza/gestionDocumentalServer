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

@Injectable()
export class UsuarioService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private tipoIdentificacion: TipoIdentificacionService,
    private tipoUsuario: TipoUsuarioService,
    private rol: RolService,
    private cargo: CargoService,
    private area: AreaService,
  ) {}

  private readonly customOut = {
    IdUsuario: true,
    Nombres: true,
    ApellidoPaterno: true,
    ApellidoMaterno: true,
    FotoPerfilNombre: true,
    FotoPerfilUrl: true,
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
    @Req() request: Request,
  ): Promise<any> {
    try {
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

      //we create new register
      const usuario = await this.prisma.usuario.create({
        data: {
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

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
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

      const usuario = await this.prisma.usuario.update({
        where: { IdUsuario: id },
        data: {
          ...updateUsuarioDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (usuario) {
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
