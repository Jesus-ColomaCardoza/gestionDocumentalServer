export interface Anexo {
  IdAnexo?: number;
  Titulo?: string;
  FormatoAnexo?: string;
  NombreAnexo?: string;
  UrlAnexo?: string;
  SizeAnexo?: number;
  UrlBase?: string;
  IdTramite?: number;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
  Tramite?: {
    IdTramite: number;
    Asunto: string;
  };
}
