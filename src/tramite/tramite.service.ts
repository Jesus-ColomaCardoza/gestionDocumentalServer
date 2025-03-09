import { Injectable, Req } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class TramiteService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private tipoTramite: TipoTramiteService,
    private estado: EstadoService,
    private remitente: UsuarioService,
  ) {}

  private readonly customOut = {
    IdTramite: true,
    Asunto: true,
    Descripcion: true,
    FechaInicio: true,
    FechaFin: true,
    Folios: true,
    Remitente: {
      select: {
        IdUsuario: true,
        Nombres: true,
        ApellidoPaterno: true,
        ApellidoMaterno: true,
      },
    },
    TipoTramite: {
      select: {
        IdTipoTramite: true,
        Descripcion: true,
      },
    },
    Estado: {
      select: {
        IdEstado: true,
        Descripcion: true,
        EsquemaEstado: {
          select: {
            IdEsquemaEstado: true,
            Descripcion: true,
          },
        },
      },
    },
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createTramiteDto: CreateTramiteDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      const idTipoTramiteFound = await this.tipoTramite.findOne(
        createTramiteDto.IdTipoTramite,
      );
      if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;

      const idEstadoFound = await this.estado.findOne(
        createTramiteDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;

      const idRemitenteFound = await this.remitente.findOne(
        createTramiteDto.IdRemitente,
      );
      if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;

      //we create new register
      const tramite = await this.prisma.tramite.create({
        data: {
          ...createTramiteDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro creado');
        return { message: this.message, registro: tramite };
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

      const tramites = await this.prisma.tramite.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (tramites) {
        this.message.setMessage(0, 'Trámite - Registros encontrados');
        return { message: this.message, registro: tramites };
      } else {
        this.message.setMessage(1, 'Error: Trámite - Registros no encontrados');
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
      const tramite = await this.prisma.tramite.findUnique({
        where: { IdTramite: id },
        select: this.customOut,
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro encontrado');
        return { message: this.message, registro: tramite };
      } else {
        this.message.setMessage(1, 'Error: Trámite - Registro no encontrado');
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
    updateTramiteDto: UpdateTramiteDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idTipoTramite = updateTramiteDto.IdTipoTramite;
      if (idTipoTramite) {
        const idTipoTramiteFound =
          await this.tipoTramite.findOne(idTipoTramite);
        if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;
      }

      const idEstado = updateTramiteDto.IdEstado;
      if (idEstado) {
        const idEstadoFound = await this.estado.findOne(idEstado);
        if (idEstadoFound.message.msgId === 1) return idEstadoFound;
      }

      const idRemitente = updateTramiteDto.IdRemitente;
      if (idRemitente) {
        const idRemitenteFound = await this.remitente.findOne(idRemitente);
        if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;
      }

      const tramite = await this.prisma.tramite.update({
        where: { IdTramite: id },
        data: {
          ...updateTramiteDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro actualizado');
        return { message: this.message, registro: tramite };
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

      const tramite = await this.prisma.tramite.delete({
        where: { IdTramite: id },
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro eliminado');
        return { message: this.message, registro: tramite };
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
