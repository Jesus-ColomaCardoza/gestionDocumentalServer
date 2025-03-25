export interface Tramite {
  IdTramite?: number;
  Asunto?: string;
  Descripcion?: string;
  FechaInicio?: Date;
  FechaFin?: Date;
  Folios?: number;
  IdRemitente?: number;
  IdTipoTramite?: number;
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
