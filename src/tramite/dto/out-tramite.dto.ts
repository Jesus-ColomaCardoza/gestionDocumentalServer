import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Tramite } from '../interfaces/tramite.interface';

export class OutTramiteDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Tramite;
}

export class OutTramiteEmitidoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: any;
}
export class OutTramitesPendienteDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: any;
}

export class OutTramitesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Tramite[];
}
