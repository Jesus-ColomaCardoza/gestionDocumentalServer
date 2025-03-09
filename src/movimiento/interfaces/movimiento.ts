export interface Movimiento {
  IdMovimiento?: number;
  FechaMovimiento?: Date;
  IdAreaOrigen?: number;
  IdAreaDestino?: number;
  IdTramite?: number;
  Activo?: boolean;
  CreadoEl?: Date;
  CreadoPor?: string;
  ModificadoEl?: Date;
  ModificadoPor?: string;
  
  AreaDestino?: {
    IdArea: number;
    Descripcion: string;
  };
  AreaOrigen?: {
    IdArea: number;
    Descripcion: string;
  };
  Tramite?: {
    IdTramite: number;
    Asunto: string;
  };
}
