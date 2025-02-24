import { PartialType } from '@nestjs/swagger';
import { Tramite } from '../entities/tramite.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTramiteDto extends PartialType(Tramite) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
