export interface Usuario {
  IdUsuario?: number;
  Nombre?: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  FechaNacimiento?: Date;
  Email?: string;
  Contrasena?: string;
  celular?: string;
  Genero?: string;
  Razonsocial?: string;
  idTipoIdentificacion?: number;
  NroIdentificacion?: string;
  IdTipoUsuario?: number;
  IdRol?: string;
  IdCargo?: number;
  IdArea?: number;
  CodigoConfirmacion?: string;
  FotoPerfilNombre?: string;
  FotoPerfilUrl?: string;
  UrlBase?: string;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;

  TipoIdentificacion?: {
    IdTipoIdentificacion: number;
    Descripcion: string;
  };
  TipoUsuario?: {
    IdTipoUsuario: number;
    Descripcion: string;
  };
  Rol?: {
    IdRol: string;
    Descripcion: string;
  };
  Cargo?: {
    IdCargo: number;
    Descripcion: string;
  };
  Area?: {
    IdArea: number;
    Descripcion: string;
  };
}
