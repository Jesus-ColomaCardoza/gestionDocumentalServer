import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { TipoUsuario } from '../interfaces/tipo-usuario';

export class OutTipoUsuarioDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoUsuario;
}

export class OutTipoUsuariosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoUsuario[];
}

