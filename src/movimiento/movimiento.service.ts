import { Injectable, Req } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TramiteService } from 'src/tramite/tramite.service';
import { AreaService } from 'src/area/area.service';
import { OutMovimientoDto, OutMovimientosDto } from './dto/out-movimiento.dto';

@Injectable()
export class MovimientoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private area: AreaService,
    private tramite: TramiteService,
  ) {}

  private readonly customOut = {
    IdMovimiento: true,
    FechaMovimiento: true,
    
    AreaDestino: {
      select: {
        IdArea: true,
        Descripcion: true,
      },
    },
    AreaOrigen: {
      select: {
        IdArea: true,
        Descripcion: true,
      },
    },
    Tramite: {
      select: {
        IdTramite: true,
        Asunto: true,
      },
    },
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createMovimientoDto: CreateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    try {
      //we validate FKs

      const idAreaOrigenFound = await this.area.findOne(
        createMovimientoDto.IdAreaOrigen,
      );
      if (idAreaOrigenFound.message.msgId === 1) return idAreaOrigenFound;

      const idAreaDestinoFound = await this.area.findOne(
        createMovimientoDto.IdAreaDestino,
      );
      if (idAreaDestinoFound.message.msgId === 1) return idAreaDestinoFound;

      const idTramiteFound = await this.tramite.findOne(createMovimientoDto.IdTramite);
      if (idTramiteFound.message.msgId === 1) return idTramiteFound;

      //we create new register
      const movimiento = await this.prisma.movimiento.create({
        data: {
          ...createMovimientoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro creado');
        return { message: this.message, registro: movimiento };
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

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutMovimientosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const movimientos = await this.prisma.movimiento.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (movimientos) {
        this.message.setMessage(0, 'Movimiento - Registros encontrados');
        return { message: this.message, registro: movimientos };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutMovimientoDto> {
    try {
      const movimiento = await this.prisma.movimiento.findUnique({
        where: { IdMovimiento: id },
        select: this.customOut,
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro encontrado');
        return { message: this.message, registro: movimiento };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registro no encontrado',
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
    updateMovimientoDto: UpdateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idAreaOrigen = updateMovimientoDto.IdAreaOrigen;
      if (idAreaOrigen) {
        const idAreaOrigenFound = await this.area.findOne(idAreaOrigen);
        if (idAreaOrigenFound.message.msgId === 1) return idAreaOrigenFound;
      }

      const idAreaDestino = updateMovimientoDto.IdAreaDestino;
      if (idAreaDestino) {
        const idAreaDestinoFound = await this.area.findOne(idAreaDestino);
        if (idAreaDestinoFound.message.msgId === 1) return idAreaDestinoFound;
      }

      const idTramite = updateMovimientoDto.IdTramite;
      if (idTramite) {
        const idTramiteFound = await this.tramite.findOne(idTramite);
        if (idTramiteFound.message.msgId === 1) return idTramiteFound;
      }

      const movimiento = await this.prisma.movimiento.update({
        where: { IdMovimiento: id },
        data: {
          ...updateMovimientoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro actualizado');
        return { message: this.message, registro: movimiento };
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

  async remove(id: number): Promise<OutMovimientoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const movimiento = await this.prisma.movimiento.delete({
        where: { IdMovimiento: id },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro eliminado');
        return { message: this.message, registro: movimiento };
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
