import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class EsquemaEstado {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
