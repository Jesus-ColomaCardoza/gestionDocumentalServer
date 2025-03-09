import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { EsquemaEstado } from '../interfaces/esquema-estado.interfaces';

export class OutEsquemaEstadoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: EsquemaEstado;
}

export class OutEsquemaEstadosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: EsquemaEstado[];
}

