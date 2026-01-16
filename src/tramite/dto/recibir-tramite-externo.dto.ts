import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Tramite } from '../entities/tramite.entity';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';

export class DigitalFile {
  Id?: number;
  UrlBase: string;
  Url: string;
  Nombre: string;
  Size: number;
  Formato: string;
  Titulo: string;
}


export class RecibirTramiteExternoDto extends Tramite {
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

  @IsInt()
  @IsNotEmpty()
  IdTipoDocumento: number;

  //data de usuario externo
  @IsString()
  @IsOptional()
  Nombres: string;

  @IsString()
  @IsOptional()
  ApellidoPaterno: string;

  @IsString()
  @IsOptional()
  ApellidoMaterno: string;

  @IsString()
  @IsOptional()
  Email: string;

  @IsString()
  @IsOptional()
  Celular: string;

  @IsString()
  @IsOptional()
  Direccion: string;

  @IsString()
  @IsOptional()
  RazonSocial: string;

  @IsInt()
  @IsOptional()
  IdTipoIdentificacion: number;

  @IsString()
  @IsOptional()
  NroIdentificacion: string;

  @IsInt()
  @IsOptional()
  IdTipoUsuario: number;

  @IsString()
  @IsOptional()
  IdRol: string;
}


export class RecibirTramiteExterno2Dto extends Tramite {
  @IsString()
  @IsNotEmpty()
  CreadoPor: string = 'test user';

  @IsDateString()
  @IsNotEmpty()
  CreadoEl: string = new Date().toISOString();

  //others
  @IsArray()
  @IsOptional()
  DigitalFiles: DigitalFile[];

  @IsArray()
  @IsOptional()
  TramiteDestinos: CreateMovimientoDto[];

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

  @IsInt()
  @IsNotEmpty()
  IdTipoDocumento: number;

  //data de usuario externo
  @IsString()
  @IsOptional()
  Nombres: string;

  @IsString()
  @IsOptional()
  ApellidoPaterno: string;

  @IsString()
  @IsOptional()
  ApellidoMaterno: string;

  @IsString()
  @IsOptional()
  Email: string;

  @IsString()
  @IsOptional()
  Celular: string;

  @IsString()
  @IsOptional()
  Direccion: string;

  @IsString()
  @IsOptional()
  RazonSocial: string;

  @IsInt()
  @IsOptional()
  IdTipoIdentificacion: number;

  @IsString()
  @IsOptional()
  NroIdentificacion: string;

  @IsInt()
  @IsOptional()
  IdTipoUsuario: number;

  @IsString()
  @IsOptional()
  IdRol: string;
}

