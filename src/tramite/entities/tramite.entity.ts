import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Tramite {
  @IsString()
  @IsNotEmpty()
  CodigoReferencia: string;

  @IsString()
  @IsNotEmpty()
  Asunto: string;

  @IsString()
  @IsOptional()
  Descripcion: string;

  @IsString()
  @IsOptional()
  Observaciones: string;

  @IsString()
  @IsOptional()
  FechaInicio: string;

  @IsString()
  @IsOptional()
  FechaFin: string;

  @IsInt()
  @IsOptional()
  Folios: number;

  @IsInt()
  @IsNotEmpty()
  IdRemitente: number;

  @IsInt()
  @IsNotEmpty()
  IdTipoTramite: number;

  @IsInt()
  @IsNotEmpty()
  IdTipoDocumento: number;

  @IsInt()
  @IsNotEmpty()
  IdAreaEmision: number;

  @IsInt()
  @IsNotEmpty()
  IdEstado: number;

  @IsBoolean()
  @IsOptional()
  Activo: boolean = true;
}
