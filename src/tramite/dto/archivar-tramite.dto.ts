import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ArchivarTramiteDto {
  @IsArray()
  @Type(() => HistoriaLMxEDto1)
  Movimientos: HistoriaLMxEDto1[]

  @IsString()
  @IsOptional()
  Detalle: string;

  @IsInt()
  @IsOptional()
  IdArchivador: number;
}

export class HistoriaLMxEDto1 {
  @IsInt()
  @IsOptional()
  IdTramite: number;

  @IsInt()
  @IsOptional()
  IdEstado: number

  @IsInt()
  @IsOptional()
  IdMovimiento: number

  @IsString()
  @IsOptional()
  Detalle: string;

  @IsDateString()
  @IsOptional()
  FechaHistorialMxE: string = new Date().toISOString();

  @IsBoolean()
  @IsOptional()
  Activo: boolean = true;

  @IsString()
  @IsOptional()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsOptional()
  CreadoEl: string = new Date().toISOString();
}

export class DesmarcarArchivarTramiteDto {
  @IsInt()
  @IsNotEmpty()
  IdMovimiento: number
}
