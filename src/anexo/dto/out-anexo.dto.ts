import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Anexo } from '../interfaces/anexo.interface';

export class OutAnexoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Anexo;
}

export class OutAnexosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Anexo[];
}
