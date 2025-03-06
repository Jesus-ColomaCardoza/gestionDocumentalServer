import { Injectable, Req } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RolService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
  ) { }

  async create(createRolDto: CreateRolDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      //we create new register
      const rol = await this.prisma.rol.create({
        data: {
          ...createRolDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (rol) {
        this.message.setMessage(0, 'Rol - Registro creado');
        return { message: this.message, registro: rol };
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

      const roles = await this.prisma.rol.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (roles) {
        this.message.setMessage(
          0,
          'Rol - Registros encontrados',
        );
        return { message: this.message, registro: roles };
      } else {
        this.message.setMessage(
          1,
          'Error: Rol - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const rol = await this.prisma.rol.findUnique({
        where: { IdRol: id },
        // select: this.customOut,
      });

      if (rol) {
        this.message.setMessage(0, 'Rol - Registro encontrado');
        return { message: this.message, registro: rol };
      } else {
        this.message.setMessage(
          1,
          'Error: Rol - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(id: string, updateRolDto: UpdateRolDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const rol = await this.prisma.rol.update({
        where: { IdRol: id },
        data: {
          ...updateRolDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (rol) {
        this.message.setMessage(0, 'Rol - Registro actualizado');
        return { message: this.message, registro: rol };
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

  async remove(id: string): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const rol = await this.prisma.rol.delete({
        where: { IdRol: id },
      });

      if (rol) {
        this.message.setMessage(0, 'Rol - Registro eliminado');
        return { message: this.message, registro: rol };
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
