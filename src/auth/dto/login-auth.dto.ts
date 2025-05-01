import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Menssage } from 'src/menssage/menssage.entity';

export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @IsString()
  @IsNotEmpty()
  Contrasena: string;
}

export class OutLoginAuthDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: {
    AccessToken: string;
    AccessTokenTime: string;
    // RefreshToken: string,
    ExpiresIn: string;
  };
}
