import { Expose } from 'class-transformer';
import { Menssage } from 'src/menssage/menssage.entity';
import { Empresa } from '../interfaces/empresa';

export class OutEmpresaDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Empresa;
}

export class OutEmpresasDto {
  @Expose()
  message: Menssage;

  @Expose()
  registro?: Empresa[];
}

