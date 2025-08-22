import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Tramite {
  @IsString()
  @IsOptional()
  CodigoReferenciaTram: string;

  @IsString()
  @IsOptional()
  Descripcion: string;

  @IsString()
  @IsOptional()
  Detalle: string;

  @IsString()
  @IsOptional()
  FechaInicio: string;

  @IsString()
  @IsOptional()
  FechaFin: string;

  @IsInt()
  @IsNotEmpty()
  IdRemitente: number;

  @IsInt()
  @IsNotEmpty()
  IdTipoTramite: number;

  @IsInt()
  @IsNotEmpty()
  IdAreaEmision: number;

  @IsInt()
  @IsOptional()
  IdArchivador: number;

  @IsInt()
  @IsOptional()
  IdDocumento: number;

  @IsInt()
  @IsNotEmpty()
  IdEstado: number;

  @IsBoolean()
  @IsOptional()
  Activo: boolean = true;
}
