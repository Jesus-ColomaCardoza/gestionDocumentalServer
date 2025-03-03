import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Carpeta } from '../entities/carpeta.entity';

export class CreateCarpetaDto extends Carpeta {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
