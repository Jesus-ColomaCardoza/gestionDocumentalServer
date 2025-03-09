import { Injectable, Req } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Request } from 'express';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';
import { Prisma } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { OutEstadoDto, OutEstadosDto } from './dto/out-estado.dto';

@Injectable()
export class EstadoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private esquemaEstado: EsquemaEstadoService,
    private filtersService: FiltersService,
  ) {}

  private readonly customOut = {
    EsquemaEstado: {
      select: { 
        IdEsquemaEstado: true, 
        Descripcion: true },
    },
  };

  async create(
    createEstadoDto: CreateEstadoDto,
    @Req() request?: Request,
  ): Promise<OutEstadoDto> {
    try {
      const idEsquemaEstadoFound = await this.esquemaEstado.findOne(
        createEstadoDto.IdEsquemaEstado,
      );
      if (idEsquemaEstadoFound.message.msgId === 1) return idEsquemaEstadoFound;

      const estado = await this.prisma.estado.create({
        data: {
          ...createEstadoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (estado) {
        this.message.setMessage(0, 'Estado - Registro creado');
        return { message: this.message, registro: estado };
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

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutEstadosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const estados = await this.prisma.estado.findMany({
        where: clausula,
        take: limitRows,
        include: this.customOut,
      });

      if (estados) {
        this.message.setMessage(0, 'Estado - Registros encontrados');
        return { message: this.message, registro: estados };
      } else {
        this.message.setMessage(1, 'Error: Estado - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutEstadoDto> {
    try {
      const estado = await this.prisma.estado.findUnique({
        where: { IdEstado: id },
        include: this.customOut,
      });

      if (estado) {
        this.message.setMessage(0, 'Estado - Registro encontrado');
        return { message: this.message, registro: estado };
      } else {
        this.message.setMessage(1, 'Error: Estado - Registro no encontrado');
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
    updateEstadoDto: UpdateEstadoDto,
    @Req() request?: Request,
  ): Promise<OutEstadoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idEsquemaEstado = updateEstadoDto.IdEsquemaEstado;
      if (idEsquemaEstado) {
        const idEsquemaEstadoFound =
          await this.esquemaEstado.findOne(idEsquemaEstado);
        if (idEsquemaEstadoFound.message.msgId === 1)
          return idEsquemaEstadoFound;
      }

      const estado = await this.prisma.estado.update({
        where: { IdEstado: id },
        data: {
          ...updateEstadoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (estado) {
        this.message.setMessage(0, 'Estado - Registro actualizado');
        return { message: this.message, registro: estado };
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

  async remove(id: number): Promise<OutEstadoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const estado = await this.prisma.estado.delete({
        where: { IdEstado: id },
      });

      if (estado) {
        this.message.setMessage(0, 'Estado - Registro eliminado');
        return { message: this.message, registro: estado };
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
