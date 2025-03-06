import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Cargo } from '../interfaces/cargo.interface';

export class OutCargoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Cargo;
}

export class OutCargosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Cargo[];
}

