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

  @IsString()
  @IsOptional()
  NombreResponsable: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
