export interface Documento {
  IdDocumento?: number;
  CodigoReferenciaDoc?: string;
  Titulo?: string;
  Descripcion?: string;
  Asunto?: string;
  Observaciones?: string;
  Folios?: number;
  FechaEmision?: Date;
  FormatoDocumento?: string;
  NombreDocumento?: string;
  UrlDocumento?: string;
  SizeDocumento?: number;
  UrlBase?: string;
  IdTipoDocumento?: number;
  IdUsuario?: number;
  IdEstado?: number;
  FirmaDigital?: boolean;
  IdCarpeta?: number;
  Categoria?: string,
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;

  TipoDocumento?: {
    IdTipoDocumento: number;
    Descripcion: string;
  };
  Estado?: {
    IdEstado: number;
    Descripcion: string;
    EsquemaEstado: {
      IdEsquemaEstado: number;
      Descripcion: string;
    };
  };
  Usuario?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
  Carpeta?: {
    IdCarpeta: number;
    Descripcion: string;
  };
}

export interface DocumentoDetails {
  IdDocumento: number;
  Folios: number;
  FechaEmision: Date;
  UrlDocumento: string;
  CreadoEl: Date;
  Asunto: string;
  CodigoReferenciaDoc: string;
  Observaciones: string;
  Visible: boolean;
  Anexo: {
    Titulo: string;
    CreadoEl: Date;
    IdAnexo: number;
    UrlAnexo: string;
  }[];
  TipoDocumento: {
    Descripcion: string;
    IdTipoDocumento: number;
  };
  Usuario: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
}