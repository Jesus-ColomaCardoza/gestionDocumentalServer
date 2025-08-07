import { IsBoolean, IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class Constante {
  
  @IsString()
  @IsNotEmpty()
  NombreTecnico: string;

  @IsString()
  @IsNotEmpty()
  IdGrupo: string;

  @IsString()
  @IsNotEmpty()
  Valor: string;

  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsInt()
  @IsOptional() 
  IdEmpresa: number;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
