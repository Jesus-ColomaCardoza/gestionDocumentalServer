import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Carpeta } from '../interfaces/carpeta';

export class OutCarpetaDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Carpeta;
}

export class OutCarpetasDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Carpeta[];
}

