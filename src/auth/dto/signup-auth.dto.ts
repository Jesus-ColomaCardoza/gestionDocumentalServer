import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Menssage } from 'src/menssage/menssage.entity';
import { TokenAuthDto } from './token-auth.dto';

export class SignupAuthDto {
  @IsString()
  @IsNotEmpty()
  Nombres: string;

  @IsString()
  @IsNotEmpty()
  ApellidoPaterno: string;

  @IsString()
  @IsNotEmpty()
  ApellidoMaterno: string;

  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @IsString()
  @IsNotEmpty()
  Contrasena: string;

  @IsString()
  @IsNotEmpty()
  ContrasenaConfirmacion: string;

  @IsString()
  @IsOptional()
  IdRol: string;

  @IsInt()
  @IsOptional()
  IdCargo: number;

  @IsInt()
  @IsOptional()
  IdArea: number;
}

export class SignupGoogleAuthDto extends TokenAuthDto{
  @IsString()
  @IsOptional()
  IdRol: string;

  @IsInt()
  @IsOptional()
  IdCargo: number;

  @IsInt()
  @IsOptional()
  IdArea: number;
}

export class OutSignupAuthDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: {
    IdUsuario: number;
  };
}
