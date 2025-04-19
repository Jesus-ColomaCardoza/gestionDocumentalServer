import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Empresa } from '../interfaces/empresa.interface';
import { ApiProperty } from '@nestjs/swagger';

export class OutEmpresaDto {
  @Expose()
  message: Menssage;

  @Expose()
  // @ApiProperty({
  //   example: {
  //     IdEmpresa: 'number',
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
  registro?: Empresa;
}

export class OutEmpresasDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Empresa[];
}
