import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { FileAws } from '../entities/file-aws.entity';

export class CreateFileAwsDto extends FileAws {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
