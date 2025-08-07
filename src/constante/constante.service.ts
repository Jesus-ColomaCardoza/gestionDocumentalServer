import { Injectable, Req } from '@nestjs/common';
import { CreateConstanteDto } from './dto/create-constante.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { OutConstanteDto, OutConstantesDto } from './dto/out-constante.dto';
import { UpdateConstanteDto } from './dto/update-cargo.dto';
import { Request } from 'express';


@Injectable()
export class ConstanteService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) {}

  async create(
    createConstanteDto: CreateConstanteDto,
    @Req() request?: Request,
  ): Promise<OutConstanteDto> {
    try {
      //we validate FKs

      //we create new register
      const constante = await this.prisma.constante.create({
        data: {
          ...createConstanteDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (constante) {
        this.message.setMessage(0, 'Constante - Registro creado');
        return { message: this.message, registro: constante };
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

  async findAll(
    combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutConstantesDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const constantes = await this.prisma.constante.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (constantes) {
        this.message.setMessage(0, 'Constante - Registros encontrados');
        return { message: this.message, registro: constantes };
      } else {
        this.message.setMessage(1, 'Error: Constante - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutConstanteDto> {
    try {
      const constante = await this.prisma.constante.findUnique({
        where: { IdConstante: id },
        // select: this.customOut,
      });

      if (constante) {
        this.message.setMessage(0, 'Constante - Registro encontrado');
        return { message: this.message, registro: constante };
      } else {
        this.message.setMessage(1, 'Error: Constante - Registro no encontrado');
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
    updateConstanteDto: UpdateConstanteDto,
    @Req() request?: Request,
  ): Promise<OutConstanteDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const constante = await this.prisma.constante.update({
        where: { IdConstante: id },
        data: {
          ...updateConstanteDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (constante) {
        this.message.setMessage(0, 'Constante - Registro actualizado');
        return { message: this.message, registro: constante };
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

  async remove(id: number): Promise<OutConstanteDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const constante = await this.prisma.constante.delete({
        where: { IdConstante: id },
      });

      if (constante) {
        this.message.setMessage(0, 'Constante - Registro eliminado');
        return { message: this.message, registro: constante };
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
