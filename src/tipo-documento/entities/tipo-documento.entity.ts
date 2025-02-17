import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TipoDocumento {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
