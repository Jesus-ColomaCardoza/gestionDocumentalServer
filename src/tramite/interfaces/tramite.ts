export interface Tramite {
  IdTramite?: number;
  CodigoReferencia?: string;
  Asunto?: string;
  Descripcion?: string;
  Observaciones?: string;
  FechaInicio?: Date;
  FechaFin?: Date;
  Folios?: number;
  IdRemitente?: number;
  IdTipoTramite?: number;
  IdTipoDocumento?: number;
  IdAreaEmision?: number;
  IdEstado?: number;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
  TipoTramite?: {
    IdTipoTramite: number;
    Descripcion: string;
  };
  TipoDocumento?: {
    IdTipoDocumento: number;
    Descripcion: string;
  };
  Area?: {
    IdArea: number;
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
  Remitente?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
}
