import { IsBoolean, IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class Carpeta {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsInt()
  @IsOptional()
  IdCarpetaPadre: number;

  @IsInt()
  @IsNotEmpty()
  IdUsuario: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
