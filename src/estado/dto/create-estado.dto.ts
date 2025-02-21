import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Estado } from '../entities/estado.entity';

export class CreateEstadoDto extends Estado {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
