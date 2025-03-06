import { Injectable, Req } from '@nestjs/common';
import { CreateEsquemaEstadoDto } from './dto/create-esquema-estado.dto';
import { UpdateEsquemaEstadoDto } from './dto/update-esquema-estado.dto';
import { Request } from 'express';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EsquemaEstadoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) {}

  async create(
    createEsquemaEstadoDto: CreateEsquemaEstadoDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      //we create new register
      const esquemaEstado = await this.prisma.esquemaEstado.create({
        data: {
          ...createEsquemaEstadoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (esquemaEstado) {
        this.message.setMessage(0, 'Esquema Estado - Registro creado');
        return { message: this.message, registro: esquemaEstado };
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

      const esquemaEstados = await this.prisma.esquemaEstado.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (esquemaEstados) {
        this.message.setMessage(0, 'Esquema Estado - Registros encontrados');
        return { message: this.message, registro: esquemaEstados };
      } else {
        this.message.setMessage(1, 'Error: Esquema Estado - Registros no encontrados');
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
      const esquemaEstado = await this.prisma.esquemaEstado.findUnique({
        where: { IdEsquemaEstado: id },
        // select: this.customOut,
      });

      if (esquemaEstado) {
        this.message.setMessage(0, 'Esquema Estado - Registro encontrado');
        return { message: this.message, registro: esquemaEstado };
      } else {
        this.message.setMessage(1, 'Error: Esquema Estado - Registro no encontrado');
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
    updateEsquemaEstadoDto: UpdateEsquemaEstadoDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const esquemaEstado = await this.prisma.esquemaEstado.update({
        where: { IdEsquemaEstado: id },
        data: {
          ...updateEsquemaEstadoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (esquemaEstado) {
        this.message.setMessage(0, 'Esquema Estado - Registro actualizado');
        return { message: this.message, registro: esquemaEstado };
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

      const esquemaEstado = await this.prisma.esquemaEstado.delete({
        where: { IdEsquemaEstado: id },
      });

      if (esquemaEstado) {
        this.message.setMessage(0, 'Esquema Estado - Registro eliminado');
        return { message: this.message, registro: esquemaEstado };
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
