import { Injectable, Req } from '@nestjs/common';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';
import { UpdateTipoTramiteDto } from './dto/update-tipo-tramite.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TipoTramite } from './entities/tipo-tramite.entity';

@Injectable()
export class TipoTramiteService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) { }

  async create(
    createTipoTramiteDto: CreateTipoTramiteDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      //we create new register
      const tipoTramite = await this.prisma.tipoTramite.create({
        data: {
          ...createTipoTramiteDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoTramite) {
        this.message.setMessage(0, 'Tipo Trámite - Registro creado');
        return { message: this.message, registro: tipoTramite };
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

      const tipotramites = await this.prisma.tipoTramite.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (tipotramites) {
        this.message.setMessage(
          0,
          'Tipo Trámite - Registros encontrados',
        );
        return { message: this.message, registro: tipotramites };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo Trámite - Registros no encontrados',
        );
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
      const tipoTramite = await this.prisma.tipoTramite.findUnique({
        where: { IdTipoTramite: id },
        // select: this.customOut,
      });

      if (tipoTramite) {
        this.message.setMessage(0, 'Tipo Trámite - Registro encontrado');
        return { message: this.message, registro: tipoTramite };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo Trámite - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(id: number,
    updateTipoTramiteDto: UpdateTipoTramiteDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tipoTramite = await this.prisma.tipoTramite.update({
        where: { IdTipoTramite: id },
        data: {
          ...updateTipoTramiteDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoTramite) {
        this.message.setMessage(0, 'Tipo Trámite - Registro actualizado');
        return { message: this.message, registro: tipoTramite };
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

      const tipoTramite = await this.prisma.tipoTramite.delete({
        where: { IdTipoTramite: id },
      });

      if (tipoTramite) {
        this.message.setMessage(0, 'Tipo Trámite - Registro eliminado');
        return { message: this.message, registro: tipoTramite };
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
