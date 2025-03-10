export interface Compartido {
  IdCompartido?: number;
  TipoElementoCompartido?: string;
  IdElementoCompartido?: number;
  IdUsuarioCompartido?: number;
  Permisos?: string;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;

  Usuario?: {
    IdUsuario: number;
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
  };
}
