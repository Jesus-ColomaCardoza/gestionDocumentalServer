import { Injectable, Req } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Menssage } from 'src/menssage/menssage.entity';
import { Prisma } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';
import { OutAreaDto, OutAreasDto } from './dto/out-area.dto';

@Injectable()
export class AreaService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) { }

  async create(
    createAreaDto: CreateAreaDto,
    @Req() request?: Request,
  ): Promise<OutAreaDto> {
    try {
      //we validate FKs

      //we create new register
      const area = await this.prisma.area.create({
        data: {
          ...createAreaDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (area) {
        this.message.setMessage(0, 'Área - Registro creado');
        return { message: this.message, registro: area };
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

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutAreasDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const areas = await this.prisma.area.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (areas) {
        this.message.setMessage(0, 'Área - Registros encontrados');
        return { message: this.message, registro: areas };
      } else {
        this.message.setMessage(1, 'Error: Área - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutAreaDto> {
    try {
      const area = await this.prisma.area.findUnique({
        where: { IdArea: id },
        // select: this.customOut,
      });

      if (area) {
        this.message.setMessage(0, 'Área - Registro encontrado');
        return { message: this.message, registro: area };
      } else {
        this.message.setMessage(1, 'Error: Área - Registro no encontrado');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOneValidate(id: number): Promise<OutAreaDto> {
    try {
      const area = await this.prisma.area.findUnique({
        where: { IdArea: id },
        select: {
          IdArea: true,
          Descripcion: true,
        },
      });

      if (area) {
        this.message.setMessage(0, 'Área - Registro encontrado');
        return { message: this.message, registro: area };
      } else {
        this.message.setMessage(1, 'Error: Área - Registro no encontrado');
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
    updateAreaDto: UpdateAreaDto,
    @Req() request?: Request,
  ): Promise<OutAreaDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const area = await this.prisma.area.update({
        where: { IdArea: id },
        data: {
          ...updateAreaDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (area) {
        this.message.setMessage(0, 'Área - Registro actualizado');
        return { message: this.message, registro: area };
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

  async remove(id: number): Promise<OutAreaDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const area = await this.prisma.area.delete({
        where: { IdArea: id },
      });

      if (area) {
        this.message.setMessage(0, 'Área - Registro eliminado');
        return { message: this.message, registro: area };
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
