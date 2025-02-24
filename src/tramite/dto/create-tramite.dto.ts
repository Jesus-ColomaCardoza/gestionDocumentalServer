import { Tramite } from '../entities/tramite.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTramiteDto extends Tramite {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
