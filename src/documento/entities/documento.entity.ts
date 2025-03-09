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
  @IsOptional()
  CodigoReferencia: string;

  @IsString()
  @IsOptional()
  Titulo: string;

  @IsString()
  @IsOptional()
  Descripcion: string;

  @IsInt()
  @IsOptional()
  Folios: number;

  @IsDateString()
  @IsOptional()
  FechaEmision: string;

  @IsString()
  @IsOptional()
  UrlDocumento: string;

  @IsString()
  @IsOptional()
  FormatoDocumento: string;
  
  @IsString()
  @IsOptional()
  NombreDocumento: string;

  @IsInt()
  @IsNotEmpty()
  IdTipoDocumento: number;

  @IsInt()
  @IsOptional()
  IdTramite: number;

  @IsInt()
  @IsNotEmpty()
  IdUsuario: number;

  @IsBoolean()
  @IsNotEmpty()
  FirmaDigital: boolean = false;

  @IsInt()
  @IsOptional()
  IdCarpeta: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
