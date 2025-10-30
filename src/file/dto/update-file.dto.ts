import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsNotEmpty()
  IdDocumento: string;

  // @IsString()
  // @IsNotEmpty()
  // PublicUrl: string;
}
