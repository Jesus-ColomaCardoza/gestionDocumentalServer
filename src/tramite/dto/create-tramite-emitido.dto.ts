import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Tramite } from '../entities/tramite.entity';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';

export class CreateTramiteEmitidoDto extends Tramite {
  @IsArray()
  @IsOptional()
  DigitalFiles: FileManager[];

  @IsArray()
  @IsOptional()
  TramiteDestinos: CreateMovimientoDto[];

  @IsArray()
  @IsOptional()
  Anexos: CreateAnexoDto[]

  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();
}
