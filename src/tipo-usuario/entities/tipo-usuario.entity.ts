import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TipoUsuario {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
