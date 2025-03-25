import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Documento } from '../interfaces/documento';

export class OutDocumentoDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Documento;
}

export class OutDocumentosDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Documento[];
}
