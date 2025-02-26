import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Empresa } from '../entities/empresa.entity';

export class CreateEmpresaDto extends Empresa {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
