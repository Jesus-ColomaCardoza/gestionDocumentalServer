import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BuscarDniDto {
  @IsString()
  @IsOptional()
  Dni: string = '12345678';
}
