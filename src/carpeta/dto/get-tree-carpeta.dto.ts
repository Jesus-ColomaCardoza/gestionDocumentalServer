import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';

export class GetTreeCarpetaDto extends CombinationsFiltersDto {
  @IsString()
  @IsOptional()
  CustomIcon: string;

  @IsInt()
  @IsNotEmpty()
  IdArea: number;

  @IsInt()
  @IsNotEmpty()
  NotIncludeIdCarpeta: number;
}
