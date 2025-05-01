import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Menssage } from 'src/menssage/menssage.entity';

export class ResetPasswordAuthDto {
  @IsString()
  @IsNotEmpty()
  CodigoConfirmacion: string;

  @IsString()
  @IsNotEmpty()
  Contrasena: string;

  @IsString()
  @IsNotEmpty()
  ContrasenaConfirmacion: string;
}

export class OutResetPasswordAuthDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: {
    IdUsuario: string;
  };
}
