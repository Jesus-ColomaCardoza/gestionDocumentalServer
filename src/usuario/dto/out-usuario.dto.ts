import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Usuario } from '../interfaces/usuario';

export class OutUsuarioDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Usuario;
}

export class OutUsuariosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Usuario[];
}
