import { EsquemaEstado } from '../entities/esquema-estado.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEsquemaEstadoDto extends EsquemaEstado {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
