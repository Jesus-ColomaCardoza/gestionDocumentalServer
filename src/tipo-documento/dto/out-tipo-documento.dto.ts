import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { TipoDocumento } from '../interfaces/tipo-documento.interface';

export class OutTipoDocumentoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoDocumento;
}

export class OutTipoDocumentosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: TipoDocumento[];
}