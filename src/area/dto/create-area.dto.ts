import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Area } from '../entities/area.entity';

export class CreateAreaDto extends Area {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
