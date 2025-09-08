import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Movimiento, MovimientoDetails } from '../interfaces/movimiento';

export class OutMovimientoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Movimiento;
}
export class OutMovimientoDetailsDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: MovimientoDetails;
}

export class OutMovimientosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Movimiento[];
}

