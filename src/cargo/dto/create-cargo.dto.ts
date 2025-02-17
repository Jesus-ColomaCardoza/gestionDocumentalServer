import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Cargo } from '../entities/cargo.entity';

export class CreateCargoDto extends Cargo {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
