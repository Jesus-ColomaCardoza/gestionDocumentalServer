import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFileDto {
  @IsString()
  @IsNotEmpty()
  PublicUrl: string;
}
