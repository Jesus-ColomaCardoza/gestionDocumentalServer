import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Rol } from '../entities/rol.entity';

export class UpdateRolDto extends PartialType(Rol) {
  @IsString()
  @IsNotEmpty()
  ModificadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  ModificadoEl: string = new Date().toISOString();
}
