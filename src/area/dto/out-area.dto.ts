import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Area } from '../interfaces/area.interface';

export class OutAreaDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Area;
}

export class OutAreasDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Area[];
}

