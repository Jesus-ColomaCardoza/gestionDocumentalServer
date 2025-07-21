import { PartialType } from '@nestjs/swagger';
import { Anexo } from '../entities/anexo.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnexoDto extends PartialType(Anexo) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
