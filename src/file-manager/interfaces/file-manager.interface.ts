export interface FileManager {
  IdFM?: string;
  Descripcion?: string;
  FechaEmision?: Date;
  UrlFM?: string;
  FirmaDigital?: boolean | null;
  Categoria?: string;
  Activo?: boolean | null;
  Usuario?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Area: {
      IdArea: number;
      Descripcion: string;
    };
  };
  Estado?: {
    IdEstado: number;
    Descripcion: string;
  };
  Carpeta?: {
    IdCarpeta: number;
    Descripcion: string;
  };
}
