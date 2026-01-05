import { Injectable, Req } from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { TramiteService } from 'src/tramite/tramite.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CarpetaService } from 'src/carpeta/carpeta.service';
import { OutDocumentoDetailsDto, OutDocumentoDto, OutDocumentosDto } from './dto/out-documento.dto';
import { OutTipoDocumentoDto } from 'src/tipo-documento/dto/out-tipo-documento.dto';
import { EstadoService } from 'src/estado/estado.service';
import { FirmarDocumentoDto } from './dto/firmar-documento.dto';

@Injectable()
export class DocumentoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private tipoDocumento: TipoDocumentoService,
    private tramite: TramiteService,
    private usuario: UsuarioService,
    private carpeta: CarpetaService,
    private estado: EstadoService,
  ) { }

  private readonly customOut = {
    IdDocumento: true,
    CodigoReferenciaDoc: true,
    Asunto: true,
    Observaciones: true,
    Titulo: true,
    Descripcion: true,
    Folios: true,
    FechaEmision: true,
    UrlDocumento: true,
    FormatoDocumento: true,
    NombreDocumento: true,
    SizeDocumento: true,
    Categoria: true,
    TipoDocumento: {
      select: {
        IdTipoDocumento: true,
        Descripcion: true,
      },
    },
    Tramite: {
      select: {
        IdTramite: true,
      },
    },
    Usuario: {
      select: {
        IdUsuario: true,
        Nombres: true,
        ApellidoPaterno: true,
        ApellidoMaterno: true,
      },
    },
    FirmaDigital: true,
    Carpeta: {
      select: {
        IdCarpeta: true,
        Descripcion: true,
      },
    },
    Estado: {
      select: {
        IdEstado: true,
        Descripcion: true,
        EsquemaEstado: {
          select: {
            IdEsquemaEstado: true,
            Descripcion: true,
          },
        },
      },
    },
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createDocumentoDto: CreateDocumentoDto,
    request?: Request,
  ): Promise<OutDocumentoDto> {
    try {
      //we validate FKs

      const idTipoDocumento = createDocumentoDto.IdTipoDocumento;
      if (idTipoDocumento) {
        const idTipoDocumentoFound =
          await this.tipoDocumento.findOne(idTipoDocumento);
        if (idTipoDocumentoFound.message.msgId === 1)
          return idTipoDocumentoFound;
      }

      const idUsuarioFound = await this.usuario.findOne(
        createDocumentoDto.IdUsuario,
      );
      if (idUsuarioFound.message.msgId === 1) return idUsuarioFound;

      const idTramite = createDocumentoDto.IdTramite;
      if (idTramite) {
        const idTramiteFound = await this.tramite.findOne(idTramite);
        if (idTramiteFound.message.msgId === 1) return idTramiteFound;
      }

      const idCarpeta = createDocumentoDto.IdCarpeta;
      if (idCarpeta) {
        const idCarpetaFound = await this.carpeta.findOne(idCarpeta);
        if (idCarpetaFound.message.msgId === 1) return idCarpetaFound;
      }

      const idEstado = createDocumentoDto.IdEstado;
      if (idEstado) {
        const idEstadoFound = await this.estado.findOne(idEstado);
        if (idEstadoFound.message.msgId === 1) return idEstadoFound;
      }

      //we create new register
      const documento = await this.prisma.documento.create({
        data: {
          ...createDocumentoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (documento) {
        this.message.setMessage(0, 'Documento - Registro creado');
        return { message: this.message, registro: documento };
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
  ): Promise<OutDocumentosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const documentos = await this.prisma.documento.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,

      });

      if (documentos) {
        this.message.setMessage(0, 'Documento - Registros encontrados');
        return { message: this.message, registro: documentos };
      } else {
        this.message.setMessage(
          1,
          'Error: Documento - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutDocumentoDto> {
    try {
      const documento = await this.prisma.documento.findUnique({
        where: { IdDocumento: id },
        select: this.customOut,
      });

      if (documento) {
        this.message.setMessage(0, 'Documento - Registro encontrado');
        return { message: this.message, registro: documento };
      } else {
        this.message.setMessage(1, 'Error: Documento - Registro no encontrado');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOneDetails(id: number): Promise<OutDocumentoDetailsDto> {
    try {
      const documento = await this.prisma.documento.findUnique({
        where: { IdDocumento: id },
        select: {
          IdDocumento: true,
          UrlDocumento: true,
          CreadoEl: true,
          FechaEmision: true,
          CodigoReferenciaDoc: true,
          Observaciones: true,
          Asunto: true,
          Folios: true,
          Visible: true,
          TipoDocumento: {
            select: {
              IdTipoDocumento: true,
              Descripcion: true,
            }
          },
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
            }
          },
          Anexo: {
            select: {
              IdAnexo: true,
              CreadoEl: true,
              Titulo: true,
              UrlAnexo: true
            },
          },
        }
      });

      if (documento) {
        this.message.setMessage(0, 'Documento - Registro encontrado');
        return { message: this.message, registro: documento };
      } else {
        this.message.setMessage(1, 'Error: Documento - Registro no encontrado');
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
    updateDocumentoDto: UpdateDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutDocumentoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idTipoDocumento = updateDocumentoDto.IdTipoDocumento;
      if (idTipoDocumento) {
        const idTipoDocumentoFound =
          await this.tipoDocumento.findOne(idTipoDocumento);
        if (idTipoDocumentoFound.message.msgId === 1)
          return idTipoDocumentoFound;
      }

      const idUsuario = updateDocumentoDto.IdUsuario;
      if (idUsuario) {
        const idUsuarioFound = await this.usuario.findOne(idUsuario);
        if (idUsuarioFound.message.msgId === 1) return idUsuarioFound;
      }

      const idTramite = updateDocumentoDto.IdTramite;
      if (idTramite) {
        const idTramiteFound = await this.tramite.findOne(idTramite);
        if (idTramiteFound.message.msgId === 1) return idTramiteFound;
      }

      const idCarpeta = updateDocumentoDto.IdCarpeta;
      if (idCarpeta) {
        const idCarpetaFound = await this.carpeta.findOne(idCarpeta);
        if (idCarpetaFound.message.msgId === 1) return idCarpetaFound;
      }

      const idEstado = updateDocumentoDto.IdEstado;
      if (idEstado) {
        const idEstadoFound = await this.estado.findOne(idEstado);
        if (idEstadoFound.message.msgId === 1) return idEstadoFound;
      }

      const documento = await this.prisma.documento.update({
        where: { IdDocumento: id },
        data: {
          ...updateDocumentoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (documento) {
        this.message.setMessage(0, 'Documento - Registro actualizado');
        return { message: this.message, registro: documento };
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

  async remove(id: number): Promise<OutDocumentoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const documento = await this.prisma.documento.delete({
        where: { IdDocumento: id },
      });

      if (documento) {
        this.message.setMessage(0, 'Documento - Registro eliminado');
        return { message: this.message, registro: documento };
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
