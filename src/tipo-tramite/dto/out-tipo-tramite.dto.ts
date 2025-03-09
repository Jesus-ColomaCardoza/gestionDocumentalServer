import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { TipoTramite } from '../interfaces/tipo-tramite';

export class OutTipoTramiteDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoTramite;
}

export class OutTipoTramitesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoTramite[];
}

