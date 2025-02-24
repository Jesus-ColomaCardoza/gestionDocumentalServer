import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class Usuario {
  @IsString()
  @IsOptional()
  Nombres: string;

  @IsString()
  @IsOptional()
  ApellidoPaterno: string;

  @IsString()
  @IsOptional()
  ApellidoMaterno: string;

  @IsString()
  @IsOptional()
  FechaNacimiento: string;

  @IsString()
  @IsOptional()
  Email: string;

  @IsString()
  @IsOptional()
  Contrasena: string;

  @IsString()
  @IsOptional()
  CodigoConfirmacion: string;

  @IsString()
  @IsOptional()
  Celular: string;

  @ApiProperty({ example: 'M(masculino )| F(femenino)' })
  @MaxLength(1)
  @IsString()
  @IsOptional()
  @IsIn(['M', 'F'], {
    message: 'El género debe ser M (masculino) o F (femenino).',
  })
  @IsOptional()
  Genero: 'M' | 'F';

  @IsString()
  @IsOptional()
  RazonSocial: string;

  @IsInt()
  @IsOptional()
  IdTipoIdentificacion: number;

  @IsString()
  @IsOptional()
  NroIdentificacion: string;

  @IsInt()
  @IsOptional()
  IdTipoUsuario: number;

  @IsString()
  @IsOptional()
  IdRol: string;

  @IsInt()
  @IsOptional()
  IdCargo: number;

  @IsInt()
  @IsOptional()
  IdArea: number;

  //   @IsString()
  //   @IsOptional()
  //   UrlBase: string;

  //   @IsString()
  //   @IsOptional()
  //   FotoPerfilUrl: string;

  //   @IsString()
  //   @IsOptional()
  //   FotoPerfilNombre: string;

  @ApiProperty({ example: 'FotoPerfilNombreNombre' })
  @IsString()
  @IsOptional()
  FotoPerfilNombre: string;

  @ApiProperty({ example: 'FotoPerfilBase64' })
  @IsString()
  @IsOptional()
  FotoPerfilBase64: string;

  @IsBoolean()
  @IsOptional()
  Activo: boolean = true;
}
