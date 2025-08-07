import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Constante } from '../entities/constante.entity';

export class CreateConstanteDto extends Constante {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
