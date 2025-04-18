import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TipoTramite {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
