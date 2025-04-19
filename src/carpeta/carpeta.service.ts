import { Injectable, Req } from '@nestjs/common';
import { CreateCarpetaDto } from './dto/create-carpeta.dto';
import { UpdateCarpetaDto } from './dto/update-carpeta.dto';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma} from '@prisma/client';
import { Menssage } from 'src/menssage/menssage.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { OutCarpetaDto, OutCarpetasDto } from './dto/out-carpeta.dto';

@Injectable()
export class CarpetaService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private usuario: UsuarioService,
  ) {}

  private readonly customOut = {
    IdCarpeta: true,
    Descripcion: true,
    Categoria: true,
    CarpetaPadre: {
      select: {
        IdCarpeta: true,
        Descripcion: true,
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
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createCarpetaDto: CreateCarpetaDto,
    @Req() request?: Request,
  ): Promise<OutCarpetaDto> {
    try {
      //we validate FKs

      const idCarpetaPadre = createCarpetaDto.IdCarpetaPadre;
      if (idCarpetaPadre) {
        const idCarpetaPadreFound = await this.findOne(idCarpetaPadre);
        if (idCarpetaPadreFound.message.msgId === 1) return idCarpetaPadreFound;
      }

      const idUsuarioFound = await this.usuario.findOne(
        createCarpetaDto.IdUsuario,
      );
      if (idUsuarioFound.message.msgId === 1) return idUsuarioFound;

      //we create new register
      const carpeta = await this.prisma.carpeta.create({
        data: {
          ...createCarpetaDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (carpeta) {
        this.message.setMessage(0, 'Carpeta - Registro creado');
        return { message: this.message, registro: carpeta };
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

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutCarpetasDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const carpetas = await this.prisma.carpeta.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (carpetas) {
        this.message.setMessage(0, 'Carpeta - Registros encontrados');
        return { message: this.message, registro: carpetas };
      } else {
        this.message.setMessage(
          1,
          'Error: Carpeta - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutCarpetaDto> {
    try {
      const carpeta = await this.prisma.carpeta.findUnique({
        where: { IdCarpeta: id },
        select: this.customOut,
      });

      if (carpeta) {
        this.message.setMessage(0, 'Carpeta - Registro encontrado');
        return { message: this.message, registro: carpeta };
      } else {
        this.message.setMessage(
          1,
          'Error: Carpeta - Registro no encontrado',
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
    updateCarpetaDto: UpdateCarpetaDto,
    @Req() request?: Request,
  ): Promise<OutCarpetaDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idCarpetaPadre = updateCarpetaDto.IdCarpetaPadre;
      if (idCarpetaPadre) {
        const idCarpetaPadreFound = await this.findOne(idCarpetaPadre);
        if (idCarpetaPadreFound.message.msgId === 1) return idCarpetaPadreFound;
      }

      const idUsuario = updateCarpetaDto.IdUsuario;
      if (idUsuario) {
        const idUsuarioFound = await this.usuario.findOne(idUsuario);
        if (idUsuarioFound.message.msgId === 1) return idUsuarioFound;
      }

      const carpeta = await this.prisma.carpeta.update({
        where: { IdCarpeta: id },
        data: {
          ...updateCarpetaDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (carpeta) {
        this.message.setMessage(0, 'Carpeta - Registro actualizado');
        return { message: this.message, registro: carpeta };
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

  async remove(id: number): Promise<OutCarpetaDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const carpeta = await this.prisma.carpeta.delete({
        where: { IdCarpeta: id },
      });

      if (carpeta) {
        this.message.setMessage(0, 'Carpeta - Registro eliminado');
        return { message: this.message, registro: carpeta };
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
