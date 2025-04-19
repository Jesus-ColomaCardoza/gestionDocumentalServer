export interface Empresa {
  IdEmpresa?: number;
  Descripcion?: string;
  NroIdentificacion?: string;
  Email?: string;
  Celular?: string;
  RazonSocial?: string;
  FormatoLogo?: string;
  NombreLogo?: string;
  UrlLogo?: string;
  SizeLogo?: number;
  UrlBase?: string;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
}
