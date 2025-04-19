import { IsIn, IsInt, IsOptional } from 'class-validator';

export class GetFilesAreaDto {
  @IsInt()
  @IsOptional()
  IdCarpeta: number;

  @IsInt()
  @IsOptional()
  IdArea: number;

  // MF:my files, FA:files area, FS:files shared
  @IsIn(['MF', 'FA', 'FS'])
  @IsOptional()
  Categoria: string;
}
