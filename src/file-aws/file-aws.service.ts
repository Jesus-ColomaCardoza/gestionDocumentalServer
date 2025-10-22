import { Injectable, Req } from '@nestjs/common';
import { CreateFileAwsDto } from './dto/create-file-aws.dto';
import { UpdateFileAwsDto } from './dto/update-file-aws.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { FileService } from 'src/file/file.service';
import { OutFileAwsDto, OutFileAwssDto } from './dto/out-file-aws.dto';
import { extname, join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/aws/aws.service';
import { PutObjectCommand, PutObjectCommandInput, ObjectCannedACL } from '@aws-sdk/client-s3';
import { printLog } from 'src/utils/utils';

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
  ) { }

  async create(
    file: Express.Multer.File,
    // createFileAwsDto: CreateFileAwsDto,
    request?: Request,
    // ): Promise<OutFileAwsDto> {
  ): Promise<any> {
    try {

      // printLog(file);

      const fileExtName = extname(file.originalname);

      const randomName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      // const bytesFile = await file.buffer;

      // const bufferFile = Buffer.from(bytesFile);

      const folder='RRHH'
      const bucketParams: PutObjectCommandInput = {
        Bucket: this.configEnv.get('config.digOceanBucketSGD'),
        Key: `${folder+'/'+randomName+fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read' as ObjectCannedACL, // permisos
        
      };

      const result = await this.aws.s3Client.send(new PutObjectCommand(bucketParams));

      printLog(result);

      return {
        result: result,
        url: this.configEnv.get('config.digOceanEndpoint') + '/' + this.configEnv.get('config.digOceanBucketSGD') + '/' + bucketParams.Key
      }

      //we create new register
      const fileAws = null
      //  = await this.prisma.documento.create({
      //   data: 
      // });

      if (fileAws) {
        this.message.setMessage(0, 'FileAws - Registro creado');
        return { message: this.message, registro: fileAws };
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
  ): Promise<OutFileAwssDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const filesAws = await this.prisma.documento.findMany({
        where: clausula,
        take: limitRows,
        // select: this.customOut,
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
        // select: this.customOut,
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
      let file = null;
      let fileUpdate = '';
      const fileUpdateValues = ['R', 'NU', 'U'];
      // FileBase64 and NombreImagen always they will send like '', they'll never sends null or undefined
      const fileB64 =
        updateFileAwsDto.LogoBase64 === undefined
          ? ''
          : updateFileAwsDto.LogoBase64;
      const nomImagen =
        updateFileAwsDto.LogoNombre === undefined
          ? ''
          : updateFileAwsDto.LogoNombre;

      if (fileB64 == null && nomImagen == null) {
        // remove image
        fileUpdate = fileUpdateValues[0];
      } else if (fileB64 == '' && nomImagen == '') {
        // not update image
        fileUpdate = fileUpdateValues[1];
      } else if (fileB64.length > 0 && nomImagen.length > 0) {
        // update image
        fileUpdate = fileUpdateValues[2];
        if (!(updateFileAwsDto.Email && updateFileAwsDto.Email.length > 0)) {
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
        const pathOrgSaas = this.subPath + '/' + updateFileAwsDto.Email;

        file = await this.file.guardarDocumento(
          updateFileAwsDto.LogoBase64,
          pathOrgSaas,
          updateFileAwsDto.LogoNombre,
        );
        // printLog(file);
      }

      delete updateFileAwsDto.LogoBase64;
      delete updateFileAwsDto.LogoNombre;

      const fileAws = await this.prisma.documento.update({
        where: { IdDocumento: id },
        data: {}
        // fileUpdate == fileUpdateValues[0] || fileUpdate == fileUpdateValues[2]
        // ? {
        //     ...updateFileAwsDto,
        //     ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        //     UrlBase:
        //       fileUpdate == fileUpdateValues[0] ? null : file.UrlBase,
        //     UrlLogo: fileUpdate == fileUpdateValues[0] ? null : file.Url,
        //     NombreLogo:
        //       fileUpdate == fileUpdateValues[0] ? null : file.Nombre,
        //   }
        // : {
        //     ...updateFileAwsDto,
        //     ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        //   },
      });

      if (fileAws) {
        if (
          fileUpdate == fileUpdateValues[0] ||
          fileUpdate == fileUpdateValues[2]
        ) {
          await this.file.eliminarDocumento(
            idFound.registro.UrlBase + '/' + idFound.registro.NombreLogo,
          );
        }

        this.message.setMessage(0, 'FileAws - Registro actualizado');
        return { message: this.message, registro: fileAws };
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
