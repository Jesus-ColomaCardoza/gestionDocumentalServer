import { IsArray, IsString } from 'class-validator';
import { CreateFilterDto } from './create-filter.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CombinationsFiltersDto {
  @IsArray()
  filters: CreateFilterDto[];

  @ApiProperty({ example: "0" }) 
  @IsString()
  cantidad_max: string;

  @ApiProperty({ example: "ES" }) 
  @IsString()
  Language: string;
}
