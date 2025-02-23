import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TipoIdentificacion } from '../entities/tipo-identificacion.entity';

export class UpdateTipoIdentificacionDto extends PartialType(TipoIdentificacion) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
