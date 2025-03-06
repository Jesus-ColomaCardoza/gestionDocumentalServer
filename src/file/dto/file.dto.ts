import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class FileDto {
  @IsString()
  @IsNotEmpty()
  CodigoBinario: string = 'Base 64';

  @IsString()
  @IsNotEmpty()
  NombreArchivo: string = 'nombre';

  @IsString()
  @IsNotEmpty()
  Carpeta: string = 'Carpeta';
}
