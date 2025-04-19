import { Injectable } from '@nestjs/common';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FileManager } from './interfaces/file-manager.interface';
import { GetMyFilesDto } from './dto/get-my-files.dto';
import { GetFilesAreaDto } from './dto/get-files-area.dto';
import { Prisma } from '@prisma/client';
import { CreateDocumentoDto } from 'src/documento/dto/create-documento.dto';
import { CreateCarpetaDto } from 'src/carpeta/dto/create-carpeta.dto';
import { UpdateCarpetaDto } from 'src/carpeta/dto/update-carpeta.dto';
import { UpdateDocumentoDto } from 'src/documento/dto/update-documento.dto';
import {
  OutFileManagerDto,
  OutFileManagersDto,
} from './dto/out-file-manager.dto';
import { Request } from 'express';

@Injectable()
export class FileManagerService {
  private message = new Menssage();

  constructor(private prisma: PrismaService) {}

  async createCarpeta(
    createCarpetaDto: CreateCarpetaDto,
    request?: Request,
  ): Promise<OutFileManagerDto> {
    try {
      let fileManager: FileManager = {};

      const carpeta = await this.prisma.carpeta.create({
        data: {
          ...createCarpetaDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdCarpeta: true,
          Descripcion: true,
          CreadoEl: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          CarpetaPadre: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      if (carpeta) {
        fileManager = {
          IdFM: 'c_' + carpeta.IdCarpeta,
          Descripcion: carpeta.Descripcion,
          FechaEmision: carpeta.CreadoEl,
          UrlFM: null,
          FirmaDigital: null,
          Categoria: carpeta.Categoria,
          Activo: carpeta.Activo,
          Usuario: {
            IdUsuario: carpeta.Usuario.IdUsuario,
            Nombres: carpeta.Usuario.Nombres,
            ApellidoPaterno: carpeta.Usuario.ApellidoPaterno,
            ApellidoMaterno: carpeta.Usuario.ApellidoMaterno,
            Area: carpeta.Usuario.Area ? { ...carpeta.Usuario.Area } : null,
          },
          Estado: null,
          Carpeta: carpeta.CarpetaPadre ? { ...carpeta.CarpetaPadre } : null,
        };

        this.message.setMessage(0, 'File Manager - Registro creado');
        return { message: this.message, registro: fileManager };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // this code in prisma P2003-P2002 verifies referential integrity of FK and PK, we return custom message
        if (error.code === 'P2003') {
          this.message.setMessage(
            1,
            'Oops! No se puede eliminar este registro porque está relacionado con otros datos.',
          );
        } else if (error.code === 'P2002') {
          this.message.setMessage(
            1,
            'Oops! No se puede agregar este registro con Id repetido.',
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

  async createDocumento(
    createDocumentoDto: CreateDocumentoDto,
    request?: Request,
  ): Promise<OutFileManagerDto> {
    try {
      let fileManager: FileManager = {};

      const documento = await this.prisma.documento.create({
        data: {
          ...createDocumentoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          FirmaDigital: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          },
          Carpeta: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      if (documento) {
        fileManager = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          FirmaDigital: documento.FirmaDigital,
          Categoria: documento.Categoria,
          Usuario: {
            IdUsuario: documento.Usuario.IdUsuario,
            Nombres: documento.Usuario.Nombres,
            ApellidoPaterno: documento.Usuario.ApellidoPaterno,
            ApellidoMaterno: documento.Usuario.ApellidoMaterno,
            Area: documento.Usuario.Area ? { ...documento.Usuario.Area } : null,
          },
          Estado: documento.Estado ? { ...documento.Estado } : null,
          Carpeta: documento.Carpeta ? { ...documento.Carpeta } : null,
        };

        this.message.setMessage(0, 'File Manager - Registro creado');
        return { message: this.message, registro: fileManager };
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

  async findAllMyFiles(
    getMyFilesDto: GetMyFilesDto,
  ): Promise<OutFileManagersDto> {
    try {
      let filesManager: FileManager[] = [];

      const documentos = await this.prisma.documento.findMany({
        where: {
          IdUsuario: getMyFilesDto.IdUsuario,
          IdCarpeta: getMyFilesDto.IdCarpeta,
          Categoria: getMyFilesDto.Categoria,
        },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          FirmaDigital: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          },
          Carpeta: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      documentos.map((documento) => {
        let fileManager: FileManager = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          FirmaDigital: documento.FirmaDigital,
          Categoria: documento.Categoria,
          Usuario: {
            IdUsuario: documento.Usuario.IdUsuario,
            Nombres: documento.Usuario.Nombres,
            ApellidoPaterno: documento.Usuario.ApellidoPaterno,
            ApellidoMaterno: documento.Usuario.ApellidoMaterno,
            Area: documento.Usuario.Area ? { ...documento.Usuario.Area } : null,
          },
          Estado: documento.Estado ? { ...documento.Estado } : null,
          Carpeta: documento.Carpeta ? { ...documento.Carpeta } : null,
        };
        filesManager.push(fileManager);
      });

      const carpetas = await this.prisma.carpeta.findMany({
        where: {
          IdUsuario: getMyFilesDto.IdUsuario,
          IdCarpetaPadre: getMyFilesDto.IdCarpeta,
          Categoria: getMyFilesDto.Categoria,
        },
        select: {
          IdCarpeta: true,
          Descripcion: true,
          CreadoEl: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          CarpetaPadre: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      carpetas.map((carpeta) => {
        let fileManager: FileManager = {
          IdFM: 'c_' + carpeta.IdCarpeta,
          Descripcion: carpeta.Descripcion,
          FechaEmision: carpeta.CreadoEl,
          UrlFM: null,
          FirmaDigital: null,
          Categoria: carpeta.Categoria,
          Activo: carpeta.Activo,
          Usuario: {
            IdUsuario: carpeta.Usuario.IdUsuario,
            Nombres: carpeta.Usuario.Nombres,
            ApellidoPaterno: carpeta.Usuario.ApellidoPaterno,
            ApellidoMaterno: carpeta.Usuario.ApellidoMaterno,
            Area: carpeta.Usuario.Area ? { ...carpeta.Usuario.Area } : null,
          },
          Estado: null,
          Carpeta: carpeta.CarpetaPadre ? { ...carpeta.CarpetaPadre } : null,
        };
        filesManager.push(fileManager);
      });

      if (filesManager) {
        this.message.setMessage(0, 'File Manager - Registros encontrados');
        return { message: this.message, registro: filesManager };
      } else {
        this.message.setMessage(
          1,
          'Error: File Manager - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAllFilesArea(
    getFilesAreaDto: GetFilesAreaDto,
  ): Promise<OutFileManagersDto> {
    try {
      let filesManager: FileManager[] = [];

      const documentos = await this.prisma.documento.findMany({
        where: {
          IdCarpeta: getFilesAreaDto.IdCarpeta,
          Categoria: getFilesAreaDto.Categoria,
          Usuario: {
            IdArea: getFilesAreaDto.IdArea,
          },
        },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          FirmaDigital: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          },
          Carpeta: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      documentos.map((documento) => {
        let fileManager: FileManager = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          FirmaDigital: documento.FirmaDigital,
          Categoria: documento.Categoria,
          Activo: documento.Activo,
          Usuario: {
            IdUsuario: documento.Usuario.IdUsuario,
            Nombres: documento.Usuario.Nombres,
            ApellidoPaterno: documento.Usuario.ApellidoPaterno,
            ApellidoMaterno: documento.Usuario.ApellidoMaterno,
            Area: documento.Usuario.Area ? { ...documento.Usuario.Area } : null,
          },
          Estado: documento.Estado ? { ...documento.Estado } : null,
          Carpeta: documento.Carpeta ? { ...documento.Carpeta } : null,
        };
        filesManager.push(fileManager);
      });

      const carpetas = await this.prisma.carpeta.findMany({
        where: {
          IdCarpetaPadre: getFilesAreaDto.IdCarpeta,
          Categoria: getFilesAreaDto.Categoria,
          Usuario: {
            IdArea: getFilesAreaDto.IdArea,
          },
        },
        select: {
          IdCarpeta: true,
          Descripcion: true,
          CreadoEl: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          CarpetaPadre: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      carpetas.map((carpeta) => {
        let fileManager: FileManager = {
          IdFM: 'c_' + carpeta.IdCarpeta,
          Descripcion: carpeta.Descripcion,
          FechaEmision: carpeta.CreadoEl,
          UrlFM: null,
          FirmaDigital: null,
          Categoria: carpeta.Categoria,
          Activo: carpeta.Activo,
          Usuario: {
            IdUsuario: carpeta.Usuario.IdUsuario,
            Nombres: carpeta.Usuario.Nombres,
            ApellidoPaterno: carpeta.Usuario.ApellidoPaterno,
            ApellidoMaterno: carpeta.Usuario.ApellidoMaterno,
            Area: carpeta.Usuario.Area ? { ...carpeta.Usuario.Area } : null,
          },
          Estado: null,
          Carpeta: carpeta.CarpetaPadre ? { ...carpeta.CarpetaPadre } : null,
        };
        filesManager.push(fileManager);
      });

      if (filesManager) {
        this.message.setMessage(0, 'File Manager - Registros encontrados');
        return { message: this.message, registro: filesManager };
      } else {
        this.message.setMessage(
          1,
          'Error: File Manager - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutFileManagerDto> {
    return { message: this.message, registro: null };
  }

  async updateCarpeta(
    id: number,
    updateCarpetaDto: UpdateCarpetaDto,
    request?: Request,
  ): Promise<OutFileManagerDto> {
    try {
      // const idFound = await this.findOne(id);
      // if (idFound.message.msgId === 1) return idFound;

      let fileManager: FileManager = {};

      const carpeta = await this.prisma.carpeta.update({
        where: { IdCarpeta: id },
        data: {
          ...updateCarpetaDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdCarpeta: true,
          Descripcion: true,
          CreadoEl: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          CarpetaPadre: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      if (carpeta) {
        fileManager = {
          IdFM: 'c_' + carpeta.IdCarpeta,
          Descripcion: carpeta.Descripcion,
          FechaEmision: carpeta.CreadoEl,
          UrlFM: null,
          FirmaDigital: null,
          Categoria: carpeta.Categoria,
          Activo: carpeta.Activo,
          Usuario: {
            IdUsuario: carpeta.Usuario.IdUsuario,
            Nombres: carpeta.Usuario.Nombres,
            ApellidoPaterno: carpeta.Usuario.ApellidoPaterno,
            ApellidoMaterno: carpeta.Usuario.ApellidoMaterno,
            Area: carpeta.Usuario.Area ? { ...carpeta.Usuario.Area } : null,
          },
          Estado: null,
          Carpeta: carpeta.CarpetaPadre ? { ...carpeta.CarpetaPadre } : null,
        };
        this.message.setMessage(0, 'File Manager - Registro actualizado');
        return { message: this.message, registro: fileManager };
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

  async updateDocumento(
    id: number,
    updateDocumentoDto: UpdateDocumentoDto,
    request?: Request,
  ): Promise<OutFileManagerDto> {
    try {
      // const idFound = await this.findOne(id);
      // if (idFound.message.msgId === 1) return idFound;

      let fileManager: FileManager = {};

      const documento = await this.prisma.documento.update({
        where: { IdDocumento: id },
        data: {
          ...updateDocumentoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          FirmaDigital: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          },
          Carpeta: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      if (documento) {
        fileManager = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          FirmaDigital: documento.FirmaDigital,
          Categoria: documento.Categoria,
          Usuario: {
            IdUsuario: documento.Usuario.IdUsuario,
            Nombres: documento.Usuario.Nombres,
            ApellidoPaterno: documento.Usuario.ApellidoPaterno,
            ApellidoMaterno: documento.Usuario.ApellidoMaterno,
            Area: documento.Usuario.Area ? { ...documento.Usuario.Area } : null,
          },
          Estado: documento.Estado ? { ...documento.Estado } : null,
          Carpeta: documento.Carpeta ? { ...documento.Carpeta } : null,
        };

        this.message.setMessage(0, 'File Manager - Registro actualizado');
        return { message: this.message, registro: fileManager };
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

  async removeCarpeta(id: number): Promise<OutFileManagerDto> {
    try {
      // const idFound = await this.findOne(id);
      // if (idFound.message.msgId === 1) return idFound;

      let fileManager: FileManager = {};

      const carpeta = await this.prisma.carpeta.delete({
        where: { IdCarpeta: id },
        select: {
          IdCarpeta: true,
          Descripcion: true,
          CreadoEl: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          CarpetaPadre: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      if (carpeta) {
        fileManager = {
          IdFM: 'c_' + carpeta.IdCarpeta,
          Descripcion: carpeta.Descripcion,
          FechaEmision: carpeta.CreadoEl,
          UrlFM: null,
          FirmaDigital: null,
          Categoria: carpeta.Categoria,
          Activo: carpeta.Activo,
          Usuario: {
            IdUsuario: carpeta.Usuario.IdUsuario,
            Nombres: carpeta.Usuario.Nombres,
            ApellidoPaterno: carpeta.Usuario.ApellidoPaterno,
            ApellidoMaterno: carpeta.Usuario.ApellidoMaterno,
            Area: carpeta.Usuario.Area ? { ...carpeta.Usuario.Area } : null,
          },
          Estado: null,
          Carpeta: carpeta.CarpetaPadre ? { ...carpeta.CarpetaPadre } : null,
        };

        this.message.setMessage(0, 'File Manager - Registro eliminado');
        return { message: this.message, registro: fileManager };
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

  async removeDocumento(id: number): Promise<OutFileManagerDto> {
    try {
      // const idFound = await this.findOne(id);
      // if (idFound.message.msgId === 1) return idFound;

      let fileManager: FileManager = {};

      const documento = await this.prisma.documento.delete({
        where: { IdDocumento: id },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          FirmaDigital: true,
          Categoria: true,
          Activo: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              Area: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                },
              },
            },
          },
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          },
          Carpeta: {
            select: {
              IdCarpeta: true,
              Descripcion: true,
            },
          },
        },
      });

      if (documento) {
        fileManager = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          FirmaDigital: documento.FirmaDigital,
          Categoria: documento.Categoria,
          Usuario: {
            IdUsuario: documento.Usuario.IdUsuario,
            Nombres: documento.Usuario.Nombres,
            ApellidoPaterno: documento.Usuario.ApellidoPaterno,
            ApellidoMaterno: documento.Usuario.ApellidoMaterno,
            Area: documento.Usuario.Area ? { ...documento.Usuario.Area } : null,
          },
          Estado: documento.Estado ? { ...documento.Estado } : null,
          Carpeta: documento.Carpeta ? { ...documento.Carpeta } : null,
        };

        this.message.setMessage(0, 'File Manager - Registro eliminado');
        return { message: this.message, registro: fileManager };
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
