export interface RegistroFirma {
    IdRegistroFirma?: number;
    IdUsuario?: number;
    IdDocumento?: number;
    Activo?: boolean;
    CreadoEl?: Date;
    CreadoPor?: string;
    ModificadoEl?: Date;
    ModificadoPor?: string;
    
    Usuario?: {
          IdUsuario: number,
          Nombres: string,
          ApellidoPaterno: string,
          ApellidoMaterno: string,
      },
      Documento?: {
          IdDocumento: number,
          Titulo: string,
      },
  }
  