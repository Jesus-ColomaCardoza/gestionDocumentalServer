import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class Rol {
  @IsString()
  @IsNotEmpty()
  IdRol: string;

  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
