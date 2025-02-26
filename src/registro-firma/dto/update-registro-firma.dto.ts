import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { RegistroFirma } from '../entities/registro-firma.entity';

export class UpdateRegistroFirmaDto extends PartialType(RegistroFirma) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
