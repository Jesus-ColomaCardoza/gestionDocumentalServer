import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ObservarTramiteDto {
  @IsArray()
  @Type(() => HistoriaLMxEDto)
  Movimientos: HistoriaLMxEDto[]

  @IsString()
  @IsOptional()
  Observaciones: string;
}

export class HistoriaLMxEDto {
  @IsInt()
  @IsOptional()
  IdEstado: number

  @IsInt()
  @IsOptional()
  IdMovimiento: number

  @IsString()
  @IsOptional()
  Observaciones: string;

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

export class DesmarcarObservarTramiteDto {
  @IsInt()
  @IsNotEmpty()
  IdMovimiento: number
}
