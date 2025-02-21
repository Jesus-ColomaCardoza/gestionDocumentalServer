import { PartialType } from '@nestjs/swagger';
import { EsquemaEstado } from '../entities/esquema-estado.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEsquemaEstadoDto extends PartialType(EsquemaEstado) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
