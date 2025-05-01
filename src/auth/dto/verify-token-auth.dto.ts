import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Menssage } from 'src/menssage/menssage.entity';

export class VerifyTokenAuthDto {
  @IsString()
  @IsNotEmpty()
  Token: string;
}

export class OutVerifyTokenAuthDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    UrlFotoPerfil: string;
    Email: string;
    Rol?: {
      IdRol: string;
      Descripcion: string;
    };
    Area?: {
      IdArea: number;
      Descripcion: string;
    };
  };
}
