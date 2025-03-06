import { Injectable, Req } from '@nestjs/common';
import { CreateTipoIdentificacionDto } from './dto/create-tipo-identificacion.dto';
import { UpdateTipoIdentificacionDto } from './dto/update-tipo-identificacion.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class TipoIdentificacionService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) { }

  async create(createTipoIdentificacionDto: CreateTipoIdentificacionDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      //we create new register
      const tipoIdentificacion = await this.prisma.tipoIdentificacion.create({
        data: {
          ...createTipoIdentificacionDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoIdentificacion) {
        this.message.setMessage(0, 'Tipo Identificaciòn - Registro creado');
        return { message: this.message, registro: tipoIdentificacion };
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

      const tipoidentificaciones = await this.prisma.tipoIdentificacion.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (tipoidentificaciones) {
        this.message.setMessage(
          0,
          'Tipo Identificaciòn - Registros encontrados',
        );
        return { message: this.message, registro: tipoidentificaciones };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo Identificaciòn - Registros no encontrados',
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
      const tipoIdentificacion = await this.prisma.tipoIdentificacion.findUnique({
        where: { IdTipoIdentificacion: id },
        // select: this.customOut,
      });

      if (tipoIdentificacion) {
        this.message.setMessage(0, 'Tipo Identificaciòn - Registro encontrado');
        return { message: this.message, registro: tipoIdentificacion };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo Identificaciòn - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(id: number, updateTipoIdentificacionDto: UpdateTipoIdentificacionDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tipoIdentificacion = await this.prisma.tipoIdentificacion.update({
        where: { IdTipoIdentificacion: id },
        data: {
          ...updateTipoIdentificacionDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoIdentificacion) {
        this.message.setMessage(0, 'Tipo Identificaciòn - Registro actualizado');
        return { message: this.message, registro: tipoIdentificacion };
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

      const tipoIdentificacion = await this.prisma.tipoIdentificacion.delete({
        where: { IdTipoIdentificacion: id },
      });

      if (tipoIdentificacion) {
        this.message.setMessage(0, 'Tipo Identificaciòn - Registro eliminado');
        return { message: this.message, registro: tipoIdentificacion };
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
