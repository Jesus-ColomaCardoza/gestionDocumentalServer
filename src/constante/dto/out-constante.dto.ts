import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Constante } from '../interfaces/constante.interface';

export class OutConstanteDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Constante;
}
export class OutConstantesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Constante[];
}

