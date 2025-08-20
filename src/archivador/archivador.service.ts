import { Injectable, Req } from '@nestjs/common';
import { CreateArchivadorDto } from './dto/create-archivador.dto';
import { UpdateArchivadorDto } from './dto/update-archivador.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { OutArchivadorDto, OutArchivadoresDto } from './dto/out-archivador.dto';

@Injectable()
export class ArchivadorService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    
  ) {}

  async create(
    createArchivadorDto: CreateArchivadorDto,
    @Req() request?: Request,
  ): Promise<OutArchivadorDto> {
    try {
      //we validate FKs

      //we create new register
      const archivador = await this.prisma.archivador.create({
        data: {
          ...createArchivadorDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (archivador) {
        this.message.setMessage(0, 'Archivador - Registro creado');
        return { message: this.message, registro: archivador };
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
  ): Promise<OutArchivadoresDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const archivados = await this.prisma.archivador.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (archivados) {
        this.message.setMessage(0, 'Archivador - Registros encontrados');
        return { message: this.message, registro: archivados };
      } else {
        this.message.setMessage(1, 'Error: Archivador - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutArchivadorDto> {
    try {
      const archivador = await this.prisma.archivador.findUnique({
        where: { IdArchivador: id },
        // select: this.customOut,
      });

      if (archivador) {
        this.message.setMessage(0, 'Archivador - Registro encontrado');
        return { message: this.message, registro: archivador };
      } else {
        this.message.setMessage(1, 'Error: Archivador - Registro no encontrado');
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
    updateArchivadorDto: UpdateArchivadorDto,
    @Req() request?: Request,
  ): Promise<OutArchivadorDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const archivador = await this.prisma.archivador.update({
        where: { IdArchivador: id },
        data: {
          ...updateArchivadorDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (archivador) {
        this.message.setMessage(0, 'Archivador - Registro actualizado');
        return { message: this.message, registro: archivador };
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

  async remove(id: number): Promise<OutArchivadorDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const archivador = await this.prisma.archivador.delete({
        where: { IdArchivador: id },
      });

      if (archivador) {
        this.message.setMessage(0, 'Archivador - Registro eliminado');
        return { message: this.message, registro: archivador };
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
