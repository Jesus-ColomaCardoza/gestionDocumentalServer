import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BuscarRucDto {
  @IsString()
  @IsOptional()
  Ruc: string = '12345678910';
}
