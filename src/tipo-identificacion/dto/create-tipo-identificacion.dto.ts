import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TipoIdentificacion } from '../entities/tipo-identificacion.entity';

export class CreateTipoIdentificacionDto extends TipoIdentificacion {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
