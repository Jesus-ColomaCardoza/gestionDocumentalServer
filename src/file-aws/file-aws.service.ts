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
import { OutFileAwsDto, OutFileAwssDto } from './dto/out-file-aws.dto';
import { extname, join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/aws/aws.service';
import { PutObjectCommand, PutObjectCommandInput, ObjectCannedACL } from '@aws-sdk/client-s3';
import { printLog } from 'src/utils/utils';
import { AreaService } from 'src/area/area.service';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';

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
    CodigoReferencia: true,
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
        Asunto: true,
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
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    file: Express.Multer.File,
    createFileAwsDto: CreateFileAwsDto,
    request?: Request,
    // ): Promise<OutFileAwsDto> {
  ): Promise<any> {
    try {
      // printLog(file);

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

        folder = idAreaFound.registro.IdArea ? (idAreaFound.registro.IdArea + '_' + idAreaFound?.registro?.Descripcion.replace(/ /g, '_').toLowerCase()) : ''
      }

      const fileExtName = extname(file.originalname);

      const fileRandomName = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const bucketParams: PutObjectCommandInput = {
        Bucket: this.configEnv.get('config.digOceanBucketSGD'),
        Key: `${folder + '/' + fileRandomName + fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read' as ObjectCannedACL, // permisos

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

          FechaEmision: new Date().toISOString(),
          FirmaDigital: false,
          NombreDocumento: fileRandomName + fileExtName,
          Titulo: file.originalname,
          UrlDocumento: fileAwsUrl,
          FormatoDocumento: file.mimetype,
          Categoria: null,
          IdEstado: 5,// IdEstado - 5 - Archivado
          SizeDocumento: file.size,
          Visible: false,
          Activo: false, // para documentos antiguos 
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (documento) {
        this.message.setMessage(0, 'FileAws - Registro creado');
        return { message: this.message, registro: documento };
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
  ): Promise<OutFileAwssDto> {
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
    updateFileAwsDto: UpdateFileAwsDto,
    request?: Request,
  ): Promise<OutFileAwsDto> {
    try {

    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async remove(id: number): Promise<OutFileAwsDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const fileAws = await this.prisma.documento.delete({
        where: { IdDocumento: id },
      });

      if (fileAws) {
        // this.file.eliminarDocumento(fileAws.UrlBase + '/' + fileAws.NombreLogo);

        this.message.setMessage(0, 'FileAws - Registro eliminado');
        return { message: this.message, registro: fileAws };
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
