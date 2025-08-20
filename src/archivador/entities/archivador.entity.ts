import { IsBoolean, IsInt, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class Archivador {
  @IsInt()
  @IsOptional()
  Ano: number;
  
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsString()
  @IsNotEmpty()
  Nombre: string;

  @IsInt()
  @IsOptional()
  NroTramites: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
