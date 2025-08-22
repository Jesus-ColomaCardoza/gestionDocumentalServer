export interface Anexo {
  IdAnexo?: number;
  Titulo?: string;
  FormatoAnexo?: string;
  NombreAnexo?: string;
  UrlAnexo?: string;
  SizeAnexo?: number;
  UrlBase?: string;
  IdDocumento?: number;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
  Documento?: {
    IdDocumento: number;
    NombreDocumento: string;
  };
}
