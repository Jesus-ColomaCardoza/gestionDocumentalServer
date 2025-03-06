import { Injectable, Req } from '@nestjs/common';
import { CreateRegistroFirmaDto } from './dto/create-registro-firma.dto';
import { UpdateRegistroFirmaDto } from './dto/update-registro-firma.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { DocumentoService } from 'src/documento/documento.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class RegistroFirmaService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private documento: DocumentoService,
    private usuario: UsuarioService,
  ) {}

  private readonly customOut = {
    IdRegistroFirma: true,
    Usuario: {
      select: {
        IdUsuario: true,
        Nombres: true,
        ApellidoPaterno: true,
        ApellidoMaterno: true,
      },
    },
    Documento: {
      select: {
        IdDocumento: true,
        Titulo: true,
      },
    },
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createRegistroFirmaDto: CreateRegistroFirmaDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      const idDocumentoFound = await this.documento.findOne(
        createRegistroFirmaDto.IdDocumento,
      );
      if (idDocumentoFound.message.msgId === 1) return idDocumentoFound;

      const idUsuarioFound = await this.usuario.findOne(
        createRegistroFirmaDto.IdUsuario,
      );
      if (idUsuarioFound.message.msgId === 1) return idUsuarioFound;

      //we create new register
      const registroFirma = await this.prisma.registroFirma.create({
        data: {
          ...createRegistroFirmaDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (registroFirma) {
        this.message.setMessage(0, 'Registro de Firma - Registro creado');
        return { message: this.message, registro: registroFirma };
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

      const registroFirmas = await this.prisma.registroFirma.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (registroFirmas) {
        this.message.setMessage(0, 'Registro de Firma - Registros encontrados');
        return { message: this.message, registro: registroFirmas };
      } else {
        this.message.setMessage(
          1,
          'Error: Registro de Firma - Registros no encontrados',
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
      const registroFirma = await this.prisma.registroFirma.findUnique({
        where: { IdRegistroFirma: id },
        select: this.customOut,
      });

      if (registroFirma) {
        this.message.setMessage(0, 'Registro de Firma - Registro encontrado');
        return { message: this.message, registro: registroFirma };
      } else {
        this.message.setMessage(
          1,
          'Error: Registro de Firma - Registro no encontrado',
        );
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
    updateRegistroFirmaDto: UpdateRegistroFirmaDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idDocumento = updateRegistroFirmaDto.IdDocumento;
      if (idDocumento) {
        const idDocumentoFound = await this.documento.findOne(idDocumento);
        if (idDocumentoFound.message.msgId === 1) return idDocumentoFound;
      }

      const idUsuario = updateRegistroFirmaDto.IdUsuario;
      if (idUsuario) {
        const idUsuarioFound = await this.usuario.findOne(idUsuario);
        if (idUsuarioFound.message.msgId === 1) return idUsuarioFound;
      }

      const registroFirma = await this.prisma.registroFirma.update({
        where: { IdRegistroFirma: id },
        data: {
          ...updateRegistroFirmaDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (registroFirma) {
        this.message.setMessage(0, 'Registro de Firma - Registro actualizado');
        return { message: this.message, registro: registroFirma };
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

      const registroFirma = await this.prisma.registroFirma.delete({
        where: { IdRegistroFirma: id },
      });

      if (registroFirma) {
        this.message.setMessage(0, 'Registro de Firma - Registro eliminado');
        return { message: this.message, registro: registroFirma };
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
