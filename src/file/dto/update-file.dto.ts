import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsNotEmpty()
  IdDocumento: string;

  @IsIn(['true', 'false'])
  @IsNotEmpty()
  Firmar: string;

  // @IsString()
  // @IsNotEmpty()
  // PublicUrl: string;
}
