import {
  IsBoolean,
  IsString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';

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

  // MF:my files, FA:files area, FS:files shared
  @IsIn(['MF', 'FA', 'FS'])
  @IsOptional()
  Categoria: string;
}
