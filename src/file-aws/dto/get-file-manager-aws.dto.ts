import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class GetFileManagerAwsDto {
  @IsString()
  @IsOptional()
  StorageDO: string;
}
