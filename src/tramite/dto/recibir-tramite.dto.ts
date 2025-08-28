import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Tramite } from '../entities/tramite.entity';
import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';
import { Type } from 'class-transformer';

export class RecibirTramiteDto {
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
