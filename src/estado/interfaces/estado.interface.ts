export interface Estado {
    IdEstado?: number;
    Descripcion?: string;
    IdEsquemaEstado?: number;
    Activo?: boolean;
    CreadoEl?: Date;
    CreadoPor?: string;
    ModificadoEl?: Date;
    ModificadoPor?: string;

    EsquemaEstado?: {
        IdEsquemaEstado?: number, 
        Descripcion?: string },
  }