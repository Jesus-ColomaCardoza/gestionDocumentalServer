export interface Documento {
  IdDocumento?: number;
  CodigoReferencia?: string;
  Titulo?: string;
  Descripcion?: string;
  folios?: number;
  FechaEmision?: Date;
  FormatoDocumento?: string;
  NombreDocumento?: string;
  UrlDocumento?: string;
  SizeDocumento?: number;
  UrlBase?: string;
  IdTipoDocumento?: number;
  IdTramite?: number;
  IdUsuario?: number;
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
  Tramite?: {
    IdTramite: number;
    Asunto: string;
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
