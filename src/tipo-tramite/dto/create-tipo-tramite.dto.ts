import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TipoTramite } from '../entities/tipo-tramite.entity';


export class CreateTipoTramiteDto extends TipoTramite {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
