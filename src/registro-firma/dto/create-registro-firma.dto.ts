import { RegistroFirma } from '../entities/registro-firma.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateRegistroFirmaDto extends RegistroFirma {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
