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
}
