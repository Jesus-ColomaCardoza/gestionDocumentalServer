import { Movimiento } from '../entities/movimiento.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovimientoDto extends Movimiento {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
