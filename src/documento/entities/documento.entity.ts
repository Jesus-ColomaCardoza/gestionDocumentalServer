import {
  IsBoolean,
  IsDateString,
  IsIn,
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
  FormatoDocumento: string;

  @IsString()
  @IsOptional()
  NombreDocumento: string;

  @IsString()
  @IsOptional()
  UrlDocumento: string;

  @IsInt()
  @IsOptional()
  SizeDocumento: number;

  @IsString()
  @IsOptional()
  UrlBase: string;

  @IsInt()
  @IsOptional()
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

  @IsInt()
  @IsOptional()
  IdEstado: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;

  // MF:my files, FA:files area, FS:files shared
  @IsIn(['MF', 'FA', 'FS'])
  @IsOptional()
  Categoria: string;
}
