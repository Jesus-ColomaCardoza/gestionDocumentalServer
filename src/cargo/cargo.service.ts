import { Injectable, Req } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { OutCargoDto, OutCargosDto } from './dto/out-cargo.dto';

@Injectable()
export class CargoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) {}

  async create(
    createCargoDto: CreateCargoDto,
    @Req() request?: Request,
  ): Promise<OutCargoDto> {
    try {
      //we validate FKs

      //we create new register
      const cargo = await this.prisma.cargo.create({
        data: {
          ...createCargoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (cargo) {
        this.message.setMessage(0, 'Cargo - Registro creado');
        return { message: this.message, registro: cargo };
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
  ): Promise<OutCargosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const cargos = await this.prisma.cargo.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (cargos) {
        this.message.setMessage(0, 'Cargo - Registros encontrados');
        return { message: this.message, registro: cargos };
      } else {
        this.message.setMessage(1, 'Error: Cargo - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutCargoDto> {
    try {
      const cargo = await this.prisma.cargo.findUnique({
        where: { IdCargo: id },
        // select: this.customOut,
      });

      if (cargo) {
        this.message.setMessage(0, 'Cargo - Registro encontrado');
        return { message: this.message, registro: cargo };
      } else {
        this.message.setMessage(1, 'Error: Cargo - Registro no encontrado');
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
    updateCargoDto: UpdateCargoDto,
    @Req() request?: Request,
  ): Promise<OutCargoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const cargo = await this.prisma.cargo.update({
        where: { IdCargo: id },
        data: {
          ...updateCargoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (cargo) {
        this.message.setMessage(0, 'Cargo - Registro actualizado');
        return { message: this.message, registro: cargo };
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

  async remove(id: number): Promise<OutCargoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const cargo = await this.prisma.cargo.delete({
        where: { IdCargo: id },
      });

      if (cargo) {
        this.message.setMessage(0, 'Cargo - Registro eliminado');
        return { message: this.message, registro: cargo };
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
