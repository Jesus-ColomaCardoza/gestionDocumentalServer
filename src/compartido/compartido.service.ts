import { Injectable, Req } from '@nestjs/common';
import { CreateCompartidoDto } from './dto/create-compartido.dto';
import { UpdateCompartidoDto } from './dto/update-compartido.dto';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { AreaService } from 'src/area/area.service';
import { TramiteService } from 'src/tramite/tramite.service';
import { Menssage } from 'src/menssage/menssage.entity';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { UsuarioService } from 'src/usuario/usuario.service';
import { DocumentoService } from 'src/documento/documento.service';
import { CarpetaService } from 'src/carpeta/carpeta.service';

@Injectable()
export class CompartidoService {
  private message = new Menssage();
  private tipoElementoCompartidoValues = ['DOCUMENTO', 'CARPETA'];

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private usuario: UsuarioService,
    private documento: DocumentoService,
    private carpeta: CarpetaService,
  ) {}

  private readonly customOut = {
    IdCompartido: true,
    Permisos: true,
    TipoElementoCompartido: true,
    IdElementoCompartido: true,
    Usuario: {
      select: {
        IdUsuario: true,
        Nombres: true,
        ApellidoPaterno: true,
        ApellidoMaterno: true,
      },
    },
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  }

  async create(
    createCompartidoDto: CreateCompartidoDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      const tipoElementoCompartido = createCompartidoDto.TipoElementoCompartido;
      if (
        !(
          tipoElementoCompartido == this.tipoElementoCompartidoValues[0] ||
          tipoElementoCompartido == this.tipoElementoCompartidoValues[1]
        )
      ) {
        this.message.setMessage(
          1,
          'Error: Tipo de elemento compartido debe ser: DOCUMENTO o CARPETA',
        );
        return { message: this.message };
      }

      if (tipoElementoCompartido == this.tipoElementoCompartidoValues[0]) {
        const idDocumentoFound = await this.documento.findOne(
          createCompartidoDto.IdElementoCompartido,
        );
        if (idDocumentoFound.message.msgId === 1) return idDocumentoFound;
      } else if (
        tipoElementoCompartido == this.tipoElementoCompartidoValues[1]
      ) {
        const idCarpetaFound = await this.carpeta.findOne(
          createCompartidoDto.IdElementoCompartido,
        );
        if (idCarpetaFound.message.msgId === 1) return idCarpetaFound;
      }

      const idUsuarioCompartidoFound = await this.usuario.findOne(
        createCompartidoDto.IdUsuarioCompartido,
      );
      if (idUsuarioCompartidoFound.message.msgId === 1)
        return idUsuarioCompartidoFound;

      //we create new register
      const compartido = await this.prisma.compartido.create({
        data: {
          ...createCompartidoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (compartido) {
        this.message.setMessage(0, 'Compartido - Registro creado');
        return { message: this.message, registro: compartido };
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

      const compartidos = await this.prisma.compartido.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (compartidos) {
        this.message.setMessage(0, 'Compartido - Registros encontrados');
        return { message: this.message, registro: compartidos };
      } else {
        this.message.setMessage(
          1,
          'Error: Compartido - Registros no encontrados',
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
      const compartido = await this.prisma.compartido.findUnique({
        where: { IdCompartido: id },
        select: this.customOut,
      });

      if (compartido) {
        this.message.setMessage(0, 'Compartido - Registro encontrado');
        return { message: this.message, registro: compartido };
      } else {
        this.message.setMessage(
          1,
          'Error: Compartido - Registro no encontrado',
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
    updateCompartidoDto: UpdateCompartidoDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      const tipoElementoCompartido = updateCompartidoDto.TipoElementoCompartido;
      if (tipoElementoCompartido) {
        if (
          !(
            tipoElementoCompartido == this.tipoElementoCompartidoValues[0] ||
            tipoElementoCompartido == this.tipoElementoCompartidoValues[1]
          )
        ) {
          this.message.setMessage(
            1,
            'Error: Tipo de elemento compartido debe ser: DOCUMENTO o CARPETA',
          );
          return { message: this.message };
        }
  
        if (tipoElementoCompartido == this.tipoElementoCompartidoValues[0]) {
          const idDocumento = updateCompartidoDto.IdElementoCompartido;
          if (idDocumento) {
            const idDocumentoFound = await this.documento.findOne(idDocumento);
            if (idDocumentoFound.message.msgId === 1) return idDocumentoFound;
          }
        } else if (
          tipoElementoCompartido == this.tipoElementoCompartidoValues[1]
        ) {
          const idCarpeta = updateCompartidoDto.IdElementoCompartido;
          if (idCarpeta) {
            const idCarpetaFound = await this.carpeta.findOne(idCarpeta);
            if (idCarpetaFound.message.msgId === 1) return idCarpetaFound;
          }
        }
      }

      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idUsuarioCompartido = updateCompartidoDto.IdUsuarioCompartido;
      if (idUsuarioCompartido) {
        const idUsuarioCompartidoFound =
          await this.usuario.findOne(idUsuarioCompartido);
        if (idUsuarioCompartidoFound.message.msgId === 1)
          return idUsuarioCompartidoFound;
      }

      const compartido = await this.prisma.compartido.update({
        where: { IdCompartido: id },
        data: {
          ...updateCompartidoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (compartido) {
        this.message.setMessage(0, 'Compartido - Registro actualizado');
        return { message: this.message, registro: compartido };
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

      const compartido = await this.prisma.compartido.delete({
        where: { IdCompartido: id },
      });

      if (compartido) {
        this.message.setMessage(0, 'Compartido - Registro eliminado');
        return { message: this.message, registro: compartido };
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
