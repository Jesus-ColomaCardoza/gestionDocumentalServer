import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Estado } from '../interfaces/estado.interface';

export class OutEstadoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Estado;
}

export class OutEstadosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Estado[];
}

