import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Menssage } from 'src/menssage/menssage.entity';

export class ForgotPasswordAuthDto {
  @IsEmail()
  @IsNotEmpty()
  Email: string;
}

export class OutForgotPasswordAuthDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: {
    IdUsuario: number;
  };
}
