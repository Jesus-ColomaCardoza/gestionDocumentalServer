import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Cargo } from '../entities/cargo.entity';

export class UpdateCargoDto extends PartialType(Cargo) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
