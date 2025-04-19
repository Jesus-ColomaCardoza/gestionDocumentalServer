import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { FileManager } from '../interfaces/file-manager.interface';

export class OutFileManagerDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: FileManager;
}

export class OutFileManagersDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: FileManager[];
}

