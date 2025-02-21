import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class Estado {
  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsInt()
  @IsNotEmpty()
  IdEsquemaEstado: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
