import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export type FilterOperator =
  | 'EQ'
  | 'BT'
  | 'GT'
  | 'LT'
  | 'GE'
  | 'LE'
  | 'Contains';
export type FilterType =
  | 'date'
  | 'numeric2'
  | 'string'
  | 'comboPlataforma'
  | 'boolean'
  | 'other';

export class CreateFilterDto {
  @ApiProperty({ example: '0' })
  @IsString()
  campo: string;

  @ApiProperty({ example: 'EQ | BT | GT  | LT  | GE  | LE  | Contains' })
  @IsString()
  operador: FilterOperator;
  
  valor1: string;
  
  valor2?: string;
  
  @ApiProperty({ example: 'date  | numeric2 | string | comboPlataforma | other | boolean' })
  tipo: FilterType;

  // @ApiProperty({ example: 'Optional value - remove if you don\'t use it' })
  // tablaReferencia?: string; // Nueva propiedad

  // @ApiProperty({ example: 'Optional value - remove if you don\'t use it' })
  // campoReferencia?: string; // Nueva propiedad
}
