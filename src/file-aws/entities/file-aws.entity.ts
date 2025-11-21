import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class FileAws {
  @IsString()
  @IsNotEmpty()
  IdArea: string;

  @IsString()
  @IsOptional()
  Folios: string;

  @IsString()
  @IsOptional()
  IdTipoDocumento: string;



  // @IsString()
  // @IsOptional()
  // Descripcion: string;

  // @IsString()
  // @IsOptional()
  // NroIdentificacion: string;

  // @IsString()
  // @IsOptional()
  // Email: string;

  // @IsString()
  // @IsOptional()
  // Celular: string;

  // @ApiProperty({ example: 'LogoNombre' })
  // @IsString()
  // @IsOptional()
  // LogoNombre: string;

  // @ApiProperty({ example: 'LogoBase64' })
  // @IsString()
  // @IsOptional()
  // LogoBase64: string;

  // @IsBoolean()
  // @IsOptional()
  // Activo: boolean = true;
}
