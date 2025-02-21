import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TipoUsuario } from '../entities/tipo-usuario.entity';

export class CreateTipoUsuarioDto extends TipoUsuario {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
