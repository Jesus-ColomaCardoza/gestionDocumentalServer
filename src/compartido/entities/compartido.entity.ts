import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsString,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class Compartido {
  
  @IsString()
  @IsNotEmpty()
  // @IsIn(['DOCUMENTO', 'CARPETA'])
  @ApiProperty({example: 'DOCUMENTO-CARPETA'})
  TipoElementoCompartido: string;
  
  @IsInt()
  @IsNotEmpty()
  IdElementoCompartido: number;

  @IsInt()
  @IsNotEmpty()
  IdUsuarioCompartido: number;

  @IsString()
  @IsNotEmpty()
  Permisos: string;

  @IsBoolean()
  @IsNotEmpty()
  Activo: boolean = true;
}
