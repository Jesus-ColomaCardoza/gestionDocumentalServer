import { Injectable, Req } from '@nestjs/common';
import { CreateFileAwsDto } from './dto/create-file-aws.dto';
import { UpdateFileAwsDto } from './dto/update-file-aws.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Area, Prisma } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { FileService } from 'src/file/file.service';
import { OutFileAwsDto, OutFilesAwsDto, OutFilesManagerAwsDto } from './dto/out-file-aws.dto';
import path, { extname, join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/aws/aws.service';
import { PutObjectCommand, PutObjectCommandInput, ObjectCannedACL, DeleteObjectCommandInput, DeleteObjectCommand, CopyObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { printLog } from 'src/utils/utils';
import { AreaService } from 'src/area/area.service';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { FileManagerAws } from './interfaces/file-aws.interface';
import { GetFileManagerAwsDto } from './dto/get-file-manager-aws.dto';

@Injectable()
export class FileAwsService {
  private message = new Menssage();
  private subPath = 'filesAws';

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private file: FileService,
    private configEnv: ConfigService,
    private aws: AwsService,
    private area: AreaService,
    private tipoDocumento: TipoDocumentoService,
  ) { }

  private readonly customOut = {
    IdDocumento: true,
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
      },
    },
    Activo: true,
    StorageDO: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    file: Express.Multer.File,
    createFileAwsDto: CreateFileAwsDto,
    request?: Request,
  ): Promise<OutFileAwsDto> {
    try {
      // printLog(file);

      let fileManagerAws: FileManagerAws = {};

      let folder = ''

      const idTipoDocumento = createFileAwsDto.IdTipoDocumento;
      if (idTipoDocumento) {
        const idTipoDocumentoFound = await this.tipoDocumento.findOne(+idTipoDocumento);

        if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;
      }

      const idArea = createFileAwsDto.IdArea;
      if (idArea) {
        const idAreaFound = await this.area.findOneValidate(+idArea);

        if (idAreaFound.message.msgId === 1) return idAreaFound;

        folder = idAreaFound.registro.IdArea ? (idAreaFound.registro.IdArea + ''
          // + '_' + idAreaFound?.registro?.Descripcion.replace(/ /g, '_').toLowerCase()
        )
          : ''
      }

      const fileExtName = extname(file.originalname);

      const fileRandomName = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const bucketParams: PutObjectCommandInput = {
        Bucket: this.configEnv.get('config.digOceanBucketSGD'),
        Key: `${folder + '/' + fileRandomName + fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read' as ObjectCannedACL, // permisos
        ContentType: file.mimetype, // Esto es importante
        ContentDisposition: 'inline', // Esto hace que se muestre en el navegador
      };

      const fileAws = await this.aws.s3Client.send(new PutObjectCommand(bucketParams));

      if (fileAws.$metadata.httpStatusCode !== 200) {
        this.message.setMessage(1, 'Error: No se pudo guardar el archivo en aws');
        return { message: this.message };
      }

      const fileAwsUrl = this.configEnv.get('config.digOceanEndpoint') + '/' + this.configEnv.get('config.digOceanBucketSGD') + '/' + bucketParams.Key

      // printLog({ fileAws, fileAwsUrl });

      const documento = await this.prisma.documento.create({
        data: {
          IdTipoDocumento: +createFileAwsDto.IdTipoDocumento,
          Folios: +createFileAwsDto.Folios,
          Descripcion: fileRandomName + fileExtName,
          FechaEmision: new Date().toISOString(),
          FirmaDigital: false,
          NombreDocumento: fileRandomName + fileExtName,
          Titulo: path.parse(file.originalname).name,
          UrlDocumento: fileAwsUrl,
          FormatoDocumento: file.mimetype,
          Categoria: null,
          IdEstado: 5,// IdEstado - 5 - Archivado
          SizeDocumento: file.size,
          Visible: false,
          Activo: false, // para documentos antiguos 
          StorageDO: folder,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          SizeDocumento: true,
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          }
        }
      });

      if (documento) {
        fileManagerAws = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          Size: documento.SizeDocumento,
          Estado: documento.Estado ? { ...documento.Estado } : null,
        };

        this.message.setMessage(0, 'FileAws - Registro creado');
        return { message: this.message, registro: fileManagerAws };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      //delete fileAws if this service fails
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAll(
    combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutFilesAwsDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const filesAws = await this.prisma.documento.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (filesAws) {
        this.message.setMessage(0, 'FileAws - Registros encontrados');
        return { message: this.message, registro: filesAws };
      } else {
        this.message.setMessage(1, 'Error: FileAws - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAllByArea(
    getFileManagerAwsDto: GetFileManagerAwsDto,
  ): Promise<OutFilesManagerAwsDto> {
    try {
      let filesManagerAws: FileManagerAws[] = [];

      const storageDO = getFileManagerAwsDto.StorageDO ?? false

      const carpetas = await this.prisma.area.findMany({
        where: (!storageDO) ?
          {} :
          { IdArea: parseInt(getFileManagerAwsDto?.StorageDO) },
        select: {
          IdArea: true,
          Descripcion: true,
          CreadoEl: true,
        },
        orderBy: {
          CreadoEl: 'asc',
        },
      });

      if (!storageDO) {
        carpetas.map((carpeta) => {
          let fileManagerAws: FileManagerAws = {
            IdFM: 'c_' + carpeta.IdArea,
            Descripcion: carpeta.Descripcion,
            FechaEmision: carpeta.CreadoEl,
            UrlFM: null,
            Size: 0,
            Estado: null,
          };
          filesManagerAws.push(fileManagerAws);
        });

      }

      if (storageDO) {
        const documentos = await this.prisma.documento.findMany({
          where: {
            StorageDO: getFileManagerAwsDto.StorageDO
          },
          select: {
            IdDocumento: true,
            Titulo: true,
            FechaEmision: true,
            UrlDocumento: true,
            SizeDocumento: true,
            Estado: {
              select: {
                IdEstado: true,
                Descripcion: true,
              },
            },
          },
          orderBy: {
            FechaEmision: 'asc',
          },
        });

        documentos.map((documento) => {
          let fileManagerAws: FileManagerAws = {
            IdFM: 'd_' + documento.IdDocumento,
            Descripcion: documento.Titulo,
            FechaEmision: documento.FechaEmision,
            UrlFM: documento.UrlDocumento,
            Size: documento.SizeDocumento,
            Estado: documento.Estado ? { ...documento.Estado } : null,
          };
          filesManagerAws.push(fileManagerAws);
        });
      }

      if (filesManagerAws) {
        this.message.setMessage(0, 'File Manager - Registros encontrados');
        return { message: this.message, registro: filesManagerAws };
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

  async findOne(id: number): Promise<OutFileAwsDto> {
    try {
      const fileAws = await this.prisma.documento.findUnique({
        where: { IdDocumento: id },
        select: this.customOut,
      });

      if (fileAws) {
        this.message.setMessage(0, 'FileAws - Registro encontrado');
        return { message: this.message, registro: fileAws };
      } else {
        this.message.setMessage(1, 'Error: FileAws - Registro no encontrado');
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
    file: Express.Multer.File,
    updateFileAwsDto: UpdateFileAwsDto,
    request?: Request,
  ): Promise<any> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      let nuevoFolder = '';

      // Obtener el nuevo folder si se actualiza el IdArea
      const idArea = updateFileAwsDto.IdArea;
      if (idArea) {
        const idAreaFound = await this.area.findOneValidate(+idArea);
        if (idAreaFound.message.msgId === 1) return idAreaFound;

        nuevoFolder = idAreaFound.registro.IdArea
          ? (idAreaFound.registro.IdArea + ''
            // + '_' + idAreaFound?.registro?.Descripcion.replace(/ /g, '_').toLowerCase()
          )
          : '';
      }

      const idTipoDocumento = updateFileAwsDto.IdTipoDocumento;
      if (idTipoDocumento) {
        const idTipoDocumentoFound = await this.tipoDocumento.findOne(+idTipoDocumento);
        if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;
      }

      // CASO 1: Solo cambiar el folder (mover archivo a nueva ubicación sin nuevo archivo)
      if (!file && nuevoFolder !== '' && nuevoFolder !== idFound.registro.StorageDO) {
        const folderOld = idFound.registro.StorageDO;
        const fileNameOld = idFound.registro.NombreDocumento;

        // 1. Descargar el archivo
        const getParams = {
          Bucket: this.configEnv.get('config.digOceanBucketSGD'),
          Key: `${folderOld}/${fileNameOld}`,
        };

        const getObjectCommand = new GetObjectCommand(getParams);
        const response = await this.aws.s3Client.send(getObjectCommand);

        // Convertir el stream a buffer
        const chunks = [];
        const body = response.Body as NodeJS.ReadableStream;
        for await (const chunk of body) {
          chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        // 2. Subir a la nueva ubicación
        const putParams: PutObjectCommandInput = {
          Bucket: this.configEnv.get('config.digOceanBucketSGD'),
          Key: `${nuevoFolder}/${fileNameOld}`,
          Body: fileBuffer,
          ACL: 'public-read' as ObjectCannedACL,
          ContentType: file.mimetype, // Esto es importante
          ContentDisposition: 'inline', // Esto hace que se muestre en el navegador
        };

        const putResult = await this.aws.s3Client.send(new PutObjectCommand(putParams));

        if (putResult.$metadata.httpStatusCode !== 200) {
          this.message.setMessage(1, 'Error: No se pudo mover el archivo al nuevo folder');
          return { message: this.message };
        }

        // 3. Eliminar archivo del folder antiguo
        const deleteParams: DeleteObjectCommandInput = {
          Bucket: this.configEnv.get('config.digOceanBucketSGD'),
          Key: `${folderOld}/${fileNameOld}`,
        };

        await this.aws.s3Client.send(new DeleteObjectCommand(deleteParams));

        // 4. Actualizar URL y folder en la base de datos
        const fileAwsUrl = `${this.configEnv.get('config.digOceanEndpoint')}/${this.configEnv.get('config.digOceanBucketSGD')}/${nuevoFolder}/${fileNameOld}`;

        const documento = await this.prisma.documento.update({
          where: { IdDocumento: id },
          data: {
            IdTipoDocumento: +updateFileAwsDto.IdTipoDocumento,
            Folios: +updateFileAwsDto.Folios,
            StorageDO: nuevoFolder,
            UrlDocumento: fileAwsUrl,
            FechaEmision: new Date().toISOString(),
            FirmaDigital: false,
            Categoria: null,
            IdEstado: 5,
            Visible: false,
            Activo: false,
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
            ModificadoEl: new Date().toISOString(),
            ModificadoPor: `${request?.user?.id ?? 'test user'}`,
          },
        });

        this.message.setMessage(0, 'Archivo movido a nuevo folder exitosamente');
        return { message: this.message, registro: documento };
      }
      // CASO 2: Se está subiendo un nuevo archivo
      else if (file) {
        const folderOld = idFound.registro.StorageDO;

        const fileNameOld = idFound.registro.NombreDocumento;

        // Eliminar archivo antiguo si existe
        if (fileNameOld) {
          const deleteParams: DeleteObjectCommandInput = {
            Bucket: this.configEnv.get('config.digOceanBucketSGD'),
            Key: `${folderOld}/${fileNameOld}`,
          };

          await this.aws.s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        // Subir nuevo archivo
        const fileExtName = extname(file.originalname);

        const fileRandomName = Date.now() + '-' + Math.round(Math.random() * 1e9);

        // Usar nuevoFolder si está definido, sino usar el folder antiguo
        const folderParaSubir = nuevoFolder !== '' ? nuevoFolder : folderOld;

        const bucketParams: PutObjectCommandInput = {
          Bucket: this.configEnv.get('config.digOceanBucketSGD'),
          Key: `${folderParaSubir}/${fileRandomName}${fileExtName}`,
          Body: file.buffer,
          ACL: 'public-read' as ObjectCannedACL,
          ContentType: file.mimetype, // Esto es importante
          ContentDisposition: 'inline', // Esto hace que se muestre en el navegador
        };

        const fileAws = await this.aws.s3Client.send(new PutObjectCommand(bucketParams));

        if (fileAws.$metadata.httpStatusCode !== 200) {
          this.message.setMessage(1, 'Error: No se pudo actualizar el archivo en aws');
          return { message: this.message };
        }

        const fileAwsUrl = `${this.configEnv.get('config.digOceanEndpoint')}/${this.configEnv.get('config.digOceanBucketSGD')}/${bucketParams.Key}`;

        // Actualizar en base de datos
        const documento = await this.prisma.documento.update({
          where: { IdDocumento: id },
          data: {
            IdTipoDocumento: +updateFileAwsDto.IdTipoDocumento,
            Folios: +updateFileAwsDto.Folios,
            Descripcion: fileRandomName + fileExtName,
            FechaEmision: new Date().toISOString(),
            FirmaDigital: false,
            NombreDocumento: fileRandomName + fileExtName,
            Titulo: path.parse(file.originalname).name,
            UrlDocumento: fileAwsUrl,
            FormatoDocumento: file.mimetype,
            Categoria: null,
            IdEstado: 5,
            SizeDocumento: file.size,
            Visible: false,
            Activo: false,
            StorageDO: folderParaSubir,
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
            ModificadoEl: new Date().toISOString(),
            ModificadoPor: `${request?.user?.id ?? 'test user'}`,
          },
        });

        this.message.setMessage(0, 'Archivo actualizado exitosamente');
        return { message: this.message, registro: documento };
      }
      // CASO 3: Solo actualizar metadata sin cambiar archivo ni folder
      else {
        const documento = await this.prisma.documento.update({
          where: { IdDocumento: id },
          data: {
            IdTipoDocumento: +updateFileAwsDto.IdTipoDocumento,
            Folios: +updateFileAwsDto.Folios,
            FechaEmision: new Date().toISOString(),
            FirmaDigital: false,
            Categoria: null,
            IdEstado: 5,
            Visible: false,
            Activo: false,
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
            ModificadoEl: new Date().toISOString(),
            ModificadoPor: `${request?.user?.id ?? 'test user'}`,
          },
        });

        this.message.setMessage(0, 'Metadata actualizada exitosamente');
        return { message: this.message, registro: documento };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async remove(id: number): Promise<OutFileAwsDto> {
    try {
      let fileManagerAws: FileManagerAws = {};

      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const folder = idFound.registro.StorageDO

      const fileName = idFound.registro.NombreDocumento

      const bucketParams: DeleteObjectCommandInput = {
        Bucket: this.configEnv.get('config.digOceanBucketSGD'),
        Key: `${folder}/${fileName}`,
      };

      const fileAws = await this.aws.s3Client.send(new DeleteObjectCommand(bucketParams));

      // printLog(fileAws);

      if (fileAws.$metadata.httpStatusCode !== 204) {
        this.message.setMessage(1, 'Error: No se pudo eliminar el archivo en aws');
        return { message: this.message };
      }

      const documento = await this.prisma.documento.delete({
        where: { IdDocumento: id },
        select: {
          IdDocumento: true,
          Titulo: true,
          FechaEmision: true,
          UrlDocumento: true,
          SizeDocumento: true,
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            },
          },
        },
      });

      if (documento) {
        fileManagerAws = {
          IdFM: 'd_' + documento.IdDocumento,
          Descripcion: documento.Titulo,
          FechaEmision: documento.FechaEmision,
          UrlFM: documento.UrlDocumento,
          Size: documento.SizeDocumento,
          Estado: documento.Estado ? { ...documento.Estado } : null,
        };

        this.message.setMessage(0, 'FileAws - Registro eliminado');
        return { message: this.message, registro: fileManagerAws };
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
