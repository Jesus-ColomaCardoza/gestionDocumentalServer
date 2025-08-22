import { Injectable, Req } from '@nestjs/common';
import { CreateAnexoDto } from './dto/create-anexo.dto';
import { UpdateAnexoDto } from './dto/update-anexo.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TramiteService } from 'src/tramite/tramite.service';
import { OutAnexoDto, OutAnexosDto } from './dto/out-anexo.dto';
import { DocumentoService } from 'src/documento/documento.service';

@Injectable()
export class AnexoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private documento: DocumentoService,
  ) { }

  private readonly customOut = {
    IdAnexo: true,
    Titulo: true,
    UrlAnexo: true,
    FormatoAnexo: true,
    NombreAnexo: true,
    SizeAnexo: true,
    Documento: {
      select: {
        IdDocumento: true,
        NombreDocumento: true,
      },
    },
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createAnexoDto: CreateAnexoDto,
    request?: Request,
  ): Promise<OutAnexoDto> {
    try {
      //we validate FKs
      const idDocumento = createAnexoDto.IdDocumento;
      if (idDocumento) {
        const idDocumentoFound = await this.documento.findOne(idDocumento);
        if (idDocumentoFound.message.msgId === 1) return idDocumentoFound;
      }

      //we create new register
      const anexo = await this.prisma.anexo.create({
        data: {
          ...createAnexoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (anexo) {
        this.message.setMessage(0, 'Anexo - Registro creado');
        return { message: this.message, registro: anexo };
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
  ): Promise<OutAnexosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const anexos = await this.prisma.anexo.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (anexos) {
        this.message.setMessage(0, 'Anexo - Registros encontrados');
        return { message: this.message, registro: anexos };
      } else {
        this.message.setMessage(
          1,
          'Error: Anexo - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutAnexoDto> {
    try {
      const anexo = await this.prisma.anexo.findUnique({
        where: { IdAnexo: id },
        select: this.customOut,
      });

      if (anexo) {
        this.message.setMessage(0, 'Anexo - Registro encontrado');
        return { message: this.message, registro: anexo };
      } else {
        this.message.setMessage(1, 'Error: Anexo - Registro no encontrado');
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
    updateAnexoDto: UpdateAnexoDto,
    @Req() request?: Request,
  ): Promise<OutAnexoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idDocumento = updateAnexoDto.IdDocumento;
      if (idDocumento) {
        const idDocumentoFound = await this.documento.findOne(idDocumento);
        if (idDocumentoFound.message.msgId === 1) return idDocumentoFound;
      }

      const anexo = await this.prisma.anexo.update({
        where: { IdAnexo: id },
        data: {
          ...updateAnexoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (anexo) {
        this.message.setMessage(0, 'Anexo - Registro actualizado');
        return { message: this.message, registro: anexo };
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

  async remove(id: number): Promise<OutAnexoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const anexo = await this.prisma.anexo.delete({
        where: { IdAnexo: id },
      });

      if (anexo) {
        this.message.setMessage(0, 'Anexo - Registro eliminado');
        return { message: this.message, registro: anexo };
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
