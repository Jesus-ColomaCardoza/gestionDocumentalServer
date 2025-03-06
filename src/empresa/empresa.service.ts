import { Injectable, Req } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class EmpresaService {
  private message = new Menssage();
  private subPath = 'empresas';

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private file: FileService,
  ) {}

  async create(
    createEmpresaDto: CreateEmpresaDto,
    @Req() request?: Request,
  ): Promise<any> {
    try {
      let file = null;

      // FileBase64 and NombreImagen always they will send like '', they'll never sends null or undefined
      const fileUpdate =
        (createEmpresaDto.LogoBase64 || '') != '' &&
        (createEmpresaDto.LogoNombre || '') != '';

      if (fileUpdate) {
        const pathOrgSaas = this.subPath + '/' + createEmpresaDto.Email;

        file = await this.file.guardarDocumento(
          createEmpresaDto.LogoBase64,
          pathOrgSaas,
          createEmpresaDto.LogoNombre,
        );
        // printLog(file);
      }

      // we create new register
      delete createEmpresaDto.LogoBase64;
      delete createEmpresaDto.LogoNombre;

      //we validate FKs

      //we create new register
      const empresa = await this.prisma.empresa.create({
        data: fileUpdate
          ? {
              ...createEmpresaDto,
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
              UrlBase: file.UrlBase,
              LogoUrl: file.Url,
              LogoNombre: file.Nombre,
            }
          : {
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
    @Req() request?: Request,
  ): Promise<any> {
    try {
      let file = null;
      let fileUpdate = '';
      const fileUpdateValues = ['R', 'NU', 'U'];
      // FileBase64 and NombreImagen always they will send like '', they'll never sends null or undefined
      const fileB64 = updateEmpresaDto.LogoBase64;
      const nomImagen = updateEmpresaDto.LogoNombre;

      if (fileB64 == null && nomImagen == null) {
        // remove image
        fileUpdate = fileUpdateValues[0];
      } else if (fileB64 == '' && nomImagen == '') {
        // not update image
        fileUpdate = fileUpdateValues[1];
      } else if (fileB64.length > 0 && nomImagen.length > 0) {
        // update image
        fileUpdate = fileUpdateValues[2];
        if (!(updateEmpresaDto.Email && updateEmpresaDto.Email.length > 0)) {
          this.message.setMessage(
            1,
            'Error: Incorrect parameters, you have to enter Email',
          );
          return { message: this.message };
        }
      } else {
        this.message.setMessage(
          1,
          'Error: Incorrect parameters.LogoBase64 y LogoNombre',
        );
        return { message: this.message };
      }

      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      if (fileUpdate == fileUpdateValues[2]) {
        const pathOrgSaas = this.subPath + '/' + updateEmpresaDto.Email;

        file = await this.file.guardarDocumento(
          updateEmpresaDto.LogoBase64,
          pathOrgSaas,
          updateEmpresaDto.LogoNombre,
        );
        // printLog(file);
      }

      delete updateEmpresaDto.LogoBase64;
      delete updateEmpresaDto.LogoNombre;

      const empresa = await this.prisma.empresa.update({
        where: { IdEmpresa: id },
        data:
          fileUpdate == fileUpdateValues[0] || fileUpdate == fileUpdateValues[2]
            ? {
                ...updateEmpresaDto,
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
                UrlBase:
                  fileUpdate == fileUpdateValues[0] ? null : file.UrlBase,
                LogoUrl: fileUpdate == fileUpdateValues[0] ? null : file.Url,
                LogoNombre:
                  fileUpdate == fileUpdateValues[0] ? null : file.Nombre,
              }
            : {
                ...updateEmpresaDto,
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
              },
      });

      if (empresa) {
        if (
          fileUpdate == fileUpdateValues[0] ||
          fileUpdate == fileUpdateValues[2]
        ) {
          await this.file.eliminarDocumento(
            idFound.registro.UrlBase + '/' + idFound.registro.LogoNombre,
          );
        }

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
        this.file.eliminarDocumento(empresa.UrlBase + '/' + empresa.LogoNombre);

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
