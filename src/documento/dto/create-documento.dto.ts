import { Documento } from '../entities/documento.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentoDto extends Documento {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
