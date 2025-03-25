import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Compartido } from '../interfaces/compartido';

export class OutCompartidoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Compartido;
}

export class OutCompartidosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Compartido[];
}

