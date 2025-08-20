import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Archivador } from '../interfaces/archivador.interface';

export class OutArchivadorDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Archivador;
}
export class OutArchivadoresDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Archivador[];
}

