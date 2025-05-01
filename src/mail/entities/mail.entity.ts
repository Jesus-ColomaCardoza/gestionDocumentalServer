import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class Mail {
  @IsString()
  @IsNotEmpty()
  Nombres: string;

  @IsString()
  @IsNotEmpty()
  Apellidos: string;

  @ApiProperty({ example: "765612 || 932775913 || 51932775913 || +51932775913" })  
  @IsMobilePhone()
  @IsNotEmpty()
  Celular: string;

  @ApiProperty({ example: "example@gmail.com - Place your mail to do tests" })  
  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @ApiProperty({ example: "New message sent from a user" })  
  @IsString()
  @IsNotEmpty()
  Mensaje: string;
}
