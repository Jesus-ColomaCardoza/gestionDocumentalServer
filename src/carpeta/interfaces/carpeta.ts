export interface Carpeta {
  IdCarpeta?: number;
  Descripcion?: string;
  IdCarpetaPadre?: number;
  IdUsuario?: number;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;

  CarpetaPadre?: {
    IdCarpeta: number;
    Descripcion: string;
  };
  Usuario?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
}
