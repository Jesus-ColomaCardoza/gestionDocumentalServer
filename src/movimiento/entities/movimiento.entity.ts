import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class Movimiento {
  @IsInt()
  @IsNotEmpty()
  IdTramite: number;

  @IsInt()
  @IsNotEmpty()
  IdAreaOrigen: number;

  @IsInt()
  @IsNotEmpty()
  IdAreaDestino: number;

  @IsDateString()
  @IsNotEmpty()
  FechaMovimiento: string;

  @IsBoolean()
  @IsNotEmpty()
  Copia: boolean = false;

  @IsBoolean()
  @IsNotEmpty()
  FirmaDigital: boolean = false;

  @IsInt()
  @IsOptional()
  IdMovimientoPadre: number;

  @IsOptional()
  NombreResponsable: any;

  @IsString()
  @IsOptional()
  Acciones?: string;

  @IsInt()
  @IsOptional()
  IdDocumento?: number;

  @IsString()
  @IsOptional()
  Indicaciones?: string;

  @IsString()
  @IsOptional()
  Motivo?: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
