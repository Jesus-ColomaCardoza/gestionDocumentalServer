import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TipoIdentificacion {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
