import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { File } from '../interfaces/file.interface';

export class OutFileDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: File;
}

export class OutFilesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: File[];
}
