import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Tramite {
  @IsString()
  @IsNotEmpty()
  Asunto: string;

  @IsString()
  @IsOptional()
  Descripcion: string;

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
  IdEstado: number;

  @IsBoolean()
  @IsOptional()
  Activo: boolean = true;
}
