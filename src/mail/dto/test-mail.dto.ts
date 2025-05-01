import { IsNotEmpty, IsString } from 'class-validator';

export class TestMailDto {
  @IsString()
  @IsNotEmpty()
  Mail: string;
}
