import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Rol } from '../interfaces/rol.interface';

export class OutRolDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Rol;
}

export class OutRolesDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Rol[];
}