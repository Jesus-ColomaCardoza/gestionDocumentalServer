import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class Empresa {
  @IsString()
  @IsOptional()
  RazonSocial: string;

  @IsString()
  @IsOptional()
  Descripcion: string;

  @IsString()
  @IsOptional()
  NroIdentificacion: string;

  @IsString()
  @IsOptional()
  Email: string;

  @IsString()
  @IsOptional()
  Celular: string;

  @ApiProperty({ example: 'LogoNombre' })
  @IsString()
  @IsOptional()
  LogoNombre: string;

  @ApiProperty({ example: 'LogoBase64' })
  @IsString()
  @IsOptional()
  LogoBase64: string;

  @IsBoolean()
  @IsOptional()
  Activo: boolean = true;
}
