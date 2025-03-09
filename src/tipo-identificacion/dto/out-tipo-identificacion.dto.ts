import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { TipoIdentificacion } from '../interfaces/tipo-identificacion';

export class OutTipoIdentificacionDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoIdentificacion;
}

export class OutTipoIdentificacionesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoIdentificacion[];
}

