import { PartialType } from '@nestjs/swagger';
import { Movimiento } from '../entities/movimiento.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMovimientoDto extends PartialType(Movimiento) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
