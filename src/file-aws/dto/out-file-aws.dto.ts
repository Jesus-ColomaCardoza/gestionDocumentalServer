import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { FileAws, FileManagerAws } from '../interfaces/file-aws.interface';
import { ApiProperty } from '@nestjs/swagger';

export class OutFileAwsDto {
  @Expose()
  message: Menssage;

  @Expose()
  // dto salida example
  // @ApiProperty({
  //   example: {
  //     IdFileAws: 'number',
  //     Descripcion: 'string',
  //     NroIdentificacion: 'string',
  //     Email: 'string',
  //     Celular: 'string',
  //     RazonSocial: 'string',
  //     FormatoLogo: 'string',
  //     NombreLogo: 'string',
  //     UrlLogo: 'string',
  //     SizeLogo: 'number',
  //     UrlBase: 'string',
  //     Activo: 'boolean',
  //     CreadoEl: 'Date',
  //     CreadoPor: 'string',
  //     ModificadoEl: 'Date',
  //     ModificadoPor: 'string',
  //   },
  // })
  registro?: FileAws;
}

export class OutFilesAwsDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: FileAws[];
}

export class OutFilesManagerAwsDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: FileManagerAws[];
}
