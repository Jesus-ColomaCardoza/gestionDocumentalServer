import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Tramite } from '../interfaces/tramite';

export class OutTramiteDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Tramite;
}

export class OutTramitesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Tramite[];
}
