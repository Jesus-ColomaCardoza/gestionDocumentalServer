import { PartialType } from '@nestjs/swagger';
import { Documento } from '../entities/documento.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocumentoDto extends PartialType(Documento) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
