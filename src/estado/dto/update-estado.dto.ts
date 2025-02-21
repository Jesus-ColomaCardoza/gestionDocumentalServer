import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Estado } from '../entities/estado.entity';

export class UpdateEstadoDto extends PartialType(Estado) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
