import { Injectable, Req } from '@nestjs/common';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { OutTipoDocumentoDto, OutTipoDocumentosDto } from './dto/out-tipo-documento.dto';

@Injectable()
export class TipoDocumentoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) { }

  async create(createTipoDocumentoDto: CreateTipoDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutTipoDocumentoDto> {
    try {
      //we validate FKs

      //we create new register
      const tipoDocumento = await this.prisma.tipoDocumento.create({
        data: {
          ...createTipoDocumentoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoDocumento) {
        this.message.setMessage(0, 'Tipo de Documento - Registro creado');
        return { message: this.message, registro: tipoDocumento };
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

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutTipoDocumentosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const tiposDocumento = await this.prisma.tipoDocumento.findMany({
        where: clausula,
        take: limitRows,
      });

      if (tiposDocumento) {
        this.message.setMessage(
          0,
          'Tipo de Documento - Registros encontrados',
        );
        return { message: this.message, registro: tiposDocumento };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo de Documento - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutTipoDocumentoDto> {
    try {
      const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
        where: { IdTipoDocumento: id },
        // select: this.customOut,
      });

      if (tipoDocumento) {
        this.message.setMessage(0, 'Tipo de Documento - Registro encontrado');
        return { message: this.message, registro: tipoDocumento };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo de Documento - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(id: number, updateTipoDocumentoDto: UpdateTipoDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutTipoDocumentoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tipoDocumento = await this.prisma.tipoDocumento.update({
        where: { IdTipoDocumento: id },
        data: {
          ...updateTipoDocumentoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoDocumento) {
        this.message.setMessage(0, 'Tipo de Documento - Registro actualizado');
        return { message: this.message, registro: tipoDocumento };
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

  async remove(id: number): Promise<OutTipoDocumentoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tipoDocumento = await this.prisma.tipoDocumento.delete({
        where: { IdTipoDocumento: id },
      });

      if (tipoDocumento) {
        this.message.setMessage(0, 'Tipo de Documento - Registro eliminado');
        return { message: this.message, registro: tipoDocumento };
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
