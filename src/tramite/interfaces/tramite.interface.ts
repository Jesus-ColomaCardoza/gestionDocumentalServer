export interface Tramite {
  IdTramite?: number;
  CodigoReferenciaTram?: string;
  Descripcion?: string;
  FechaInicio?: Date;
  FechaFin?: Date;
  IdRemitente?: number;
  IdTipoTramite?: number;
  IdAreaEmision?: number;
  IdEstado?: number;
  IdArchivador?: number;
  IdDocumento?: number;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
  Documento?: {
    IdDocumento: number;
    NombreDocumento: string;
  };
  TipoTramite?: {
    IdTipoTramite: number;
    Descripcion: string;
  };
  Archivador?: {
    IdArchivador: number;
    Nombre: string;
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


export interface ITramiteExterno2Mail {
  IdTramite: number;
  IdDocumento: number;
  Documento: {
    IdDocumento: number;
    Folios: number;
    NombreDocumento: string;
    Asunto: string;
    CodigoReferenciaDoc: string;
    TipoDocumento: {
      Descripcion: string;
      IdTipoDocumento: number;
    };
  };
  FechaInicio: Date;
  IdAreaEmision: number;
  Remitente: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    NroIdentificacion: string;
    Email:string
  };
  TipoTramite: {
    Descripcion: string;
    IdTipoTramite: number;
  };
  Area: {
    IdArea: number;
    Descripcion: string;
  };
}