import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Rol } from '../entities/rol.entity';

export class CreateRolDto extends Rol {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
