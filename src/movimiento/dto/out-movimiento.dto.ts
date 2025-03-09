import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Movimiento } from '../interfaces/movimiento';

export class OutMovimientoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Movimiento;
}

export class OutMovimientosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Movimiento[];
}

