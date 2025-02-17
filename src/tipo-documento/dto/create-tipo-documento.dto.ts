import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TipoDocumento } from '../entities/tipo-documento.entity';

export class CreateTipoDocumentoDto extends TipoDocumento {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
