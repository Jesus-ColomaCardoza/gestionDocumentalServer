import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { RegistroFirma } from '../interfaces/registro-firma';

export class OutRegistroFirmaDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: RegistroFirma;
}

export class OutRegistroFirmasDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: RegistroFirma[];
}
