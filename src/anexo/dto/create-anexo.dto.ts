import { Anexo } from '../entities/anexo.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnexoDto extends Anexo {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
