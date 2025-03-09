import { Injectable, Req } from '@nestjs/common';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { OutTipoUsuarioDto, OutTipoUsuariosDto } from './dto/out-tipo-usuario.dto';

@Injectable()
export class TipoUsuarioService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) { }

  async create(
    createTipoUsuarioDto: CreateTipoUsuarioDto,
    @Req() request?: Request,
  ): Promise<OutTipoUsuarioDto> {
    try {
      //we validate FKs

      //we create new register
      const tipoUsuario = await this.prisma.tipoUsuario.create({
        data: {
          ...createTipoUsuarioDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoUsuario) {
        this.message.setMessage(0, 'Tipo Usuario - Registro creado');
        return { message: this.message, registro: tipoUsuario };
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
  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutTipoUsuariosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const tipoUsuarios = await this.prisma.tipoUsuario.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (tipoUsuarios) {
        this.message.setMessage(
          0,
          'Tipo Usuario - Registros encontrados',
        );
        return { message: this.message, registro: tipoUsuarios };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo Usuario - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutTipoUsuarioDto> {
    try {
      const tipoUsuario = await this.prisma.tipoUsuario.findUnique({
        where: { IdTipoUsuario: id },
        // select: this.customOut,
      });

      if (tipoUsuario) {
        this.message.setMessage(0, 'Tipo Usuario - Registro encontrado');
        return { message: this.message, registro: tipoUsuario };
      } else {
        this.message.setMessage(
          1,
          'Error: Tipo Usuario - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(id: number, updateTipoUsuarioDto: UpdateTipoUsuarioDto,
    @Req() request?: Request,): Promise<OutTipoUsuarioDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tipoUsuario = await this.prisma.tipoUsuario.update({
        where: { IdTipoUsuario: id },
        data: {
          ...updateTipoUsuarioDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tipoUsuario) {
        this.message.setMessage(0, 'Tipo Usuario - Registro actualizado');
        return { message: this.message, registro: tipoUsuario };
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

  async remove(id: number): Promise<OutTipoUsuarioDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tipoUsuario = await this.prisma.tipoUsuario.delete({
        where: { IdTipoUsuario: id },
      });

      if (tipoUsuario) {
        this.message.setMessage(0, 'Tipo Usuario - Registro eliminado');
        return { message: this.message, registro: tipoUsuario };
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
