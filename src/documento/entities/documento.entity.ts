import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class Documento {
  @IsString()
  @IsNotEmpty()
  CodigoReferencia: string;

  @IsString()
  @IsNotEmpty()
  Titulo: string;

  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsInt()
  @IsNotEmpty()
  Folios: number;

  @IsDateString()
  @IsNotEmpty()
  FechaEmision: string;

  @IsString()
  @IsOptional()
  UrlDocumento: string;

  @IsString()
  @IsOptional()
  FormatoDocumento: string;

  @IsInt()
  @IsNotEmpty()
  IdTipoDocumento: number;

  @IsInt()
  @IsNotEmpty()
  IdTramite: number;

  @IsInt()
  @IsNotEmpty()
  IdUsuario: number;

  @IsBoolean()
  @IsNotEmpty()
  FirmaDigital: boolean = false;

  @IsInt()
  @IsNotEmpty()
  IdCarpeta: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
