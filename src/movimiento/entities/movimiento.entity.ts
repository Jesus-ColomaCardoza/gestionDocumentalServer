import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
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
  Activo: boolean = true;
}
