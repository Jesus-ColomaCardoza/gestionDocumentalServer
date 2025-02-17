import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class Cargo {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
