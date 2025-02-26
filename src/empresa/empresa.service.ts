import { Injectable, Req } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';


@Injectable()
export class EmpresaService {
    private message = new Menssage();
  
    constructor(
      private prisma: PrismaService,
      private filtersService: FiltersService,
    ) {}

  async create(
    createEmpresaDto: CreateEmpresaDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      //we validate FKs

      //we create new register
      const empresa = await this.prisma.empresa.create({
        data: {
          ...createEmpresaDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (empresa) {
        this.message.setMessage(0, 'Empresa - Registro creado');
        return { message: this.message, registro: empresa };
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

      const empresas = await this.prisma.empresa.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
      });

      if (empresas) {
        this.message.setMessage(0, 'Empresa - Registros encontrados');
        return { message: this.message, registro: empresas };
      } else {
        this.message.setMessage(1, 'Error: Empresa - Registros no encontrados');
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
      const empresa = await this.prisma.empresa.findUnique({
        where: { IdEmpresa: id },
        // select: this.customOut,
      });

      if (empresa) {
        this.message.setMessage(0, 'Empresa - Registro encontrado');
        return { message: this.message, registro: empresa };
      } else {
        this.message.setMessage(1, 'Error: Empresa - Registro no encontrado');
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
    updateEmpresaDto: UpdateEmpresaDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const empresa = await this.prisma.empresa.update({
        where: { IdEmpresa: id },
        data: {
          ...updateEmpresaDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (empresa) {
        this.message.setMessage(0, 'Empresa - Registro actualizado');
        return { message: this.message, registro: empresa };
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

      const empresa = await this.prisma.empresa.delete({
        where: { IdEmpresa: id },
      });

      if (empresa) {
        this.message.setMessage(0, 'Empresa - Registro eliminado');
        return { message: this.message, registro: empresa };
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
