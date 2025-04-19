import { IsIn, IsInt, IsOptional } from 'class-validator';

export class GetMyFilesDto {
  @IsInt()
  @IsOptional()
  IdUsuario: number;

  @IsInt()
  @IsOptional()
  IdCarpeta: number;

  // MF:my files, FA:files area, FS:files shared
  @IsIn(['MF', 'FA', 'FS'])
  @IsOptional()
  Categoria: string;
}
