import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Tramite } from '../entities/tramite.entity';
import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';

export class DerivarTramiteDto {
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
  TramiteDestinos: CreateMovimientoDto[];

  @IsArray()
  @IsOptional()
  Anexos: CreateAnexoDto[]

  //data documento
  @IsString()
  @IsOptional()
  CodigoReferenciaDoc: string;

  @IsString()
  @IsOptional()
  Asunto: string;

  @IsString()
  @IsOptional()
  Observaciones: string;

  @IsInt()
  @IsOptional()
  Folios: number;

  @IsBoolean()
  @IsOptional()
  Visible: boolean = false;

  @IsInt()
  @IsOptional()
  IdTipoDocumento: number;

  @IsInt()
  @IsOptional()
  IdEstado: number;

  //movimiento
  @IsArray()
  @IsOptional()
  Movimientos: {
    IdMovimiento: number,
    Tramite: {
      IdTramite: number,
    }
  }[];

  //movimiento
  @IsInt()
  @IsOptional()
  IdRemitente: number;

  @IsInt()
  @IsOptional()
  IdAreaEmision: number;

  @IsString()
  @IsOptional()
  Acciones: string;

  @IsString()
  @IsOptional()
  Indicaciones: string;
}
