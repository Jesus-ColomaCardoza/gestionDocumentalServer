import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Archivador } from '../entities/archivador.entity';

export class CreateArchivadorDto extends Archivador {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
