import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Compartido } from '../entities/compartido.entity';

export class CreateCompartidoDto extends Compartido {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
