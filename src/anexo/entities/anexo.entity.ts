import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class Anexo {
  @IsString()
  @IsOptional()
  Titulo: string;

  @IsString()
  @IsOptional()
  FormatoAnexo: string;

  @IsString()
  @IsOptional()
  NombreAnexo: string;

  @IsString()
  @IsOptional()
  UrlAnexo: string;

  @IsInt()
  @IsOptional()
  SizeAnexo: number;

  @IsString()
  @IsOptional()
  UrlBase: string;

  @IsInt()
  @IsOptional()
  IdDocumento: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
