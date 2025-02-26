import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class RegistroFirma {
  @IsInt()
  @IsNotEmpty()
  IdUsuario: number;

  @IsInt()
  @IsNotEmpty()
  IdDocumento: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
