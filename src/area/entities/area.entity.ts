import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class Area {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
