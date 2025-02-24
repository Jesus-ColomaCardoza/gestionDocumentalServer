import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Usuario } from '../entities/usuario.entity';

export class CreateUsuarioDto extends Usuario {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
