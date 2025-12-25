export interface FileAws {
  IdDocumento?: number;
  CodigoReferenciaDoc?: string;
  Titulo?: string;
  Descripcion?: string;
  Asunto?: string;
  Observaciones?: string;
  Folios?: number;
  FechaEmision?: Date;
  FormatoDocumento?: string;
  UrlDocumento?: string;
  SizeDocumento?: number;
  UrlBase?: string;
  IdTipoDocumento?: number;
  IdUsuario?: number;
  IdEstado?: number;
  FirmaDigital?: boolean;
  IdCarpeta?: number;
  Categoria?: string,
  StorageDO?: string,
  NombreDocumento?: string,
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
}

export interface FileManagerAws {
  IdFM?: string;
  Descripcion?: string;
  FechaEmision?: Date;
  UrlFM?: string;
  Size?: number;
  Estado?: {
    IdEstado: number;
    Descripcion: string;
  };
}
