import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Tramite } from '../entities/tramite.entity';
import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';

export class CreateTramiteRecibidoAtendidoDto  {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();

  //others
  @IsArray()
  @IsOptional()
  DigitalFiles: FileManager[];

  @IsArray()
  @IsOptional()
  Anexos: CreateAnexoDto[]

  //data documento
  @IsString()
  @IsNotEmpty()
  CodigoReferenciaDoc: string;

  @IsString()
  @IsNotEmpty()
  Asunto: string;

  @IsString()
  @IsOptional()
  Observaciones: string;

  @IsInt()
  @IsOptional()
  Folios: number;

  @IsBoolean()
  @IsOptional()
  Visible: boolean=false;

  @IsInt()
  @IsNotEmpty()
  IdTipoDocumento: number;

  @IsInt()
  @IsNotEmpty()
  IdEstado: number;

  //movimiento
  @IsInt()
  @IsOptional()
  IdMovimiento: number;

  //movimiento
  @IsInt()
  @IsOptional()
  IdRemitente: number;
}
