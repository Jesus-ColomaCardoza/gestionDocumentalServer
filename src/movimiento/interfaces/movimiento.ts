export interface Movimiento {
  IdMovimiento?: number;
  FechaMovimiento?: Date;
  Copia?: boolean;
  NombreResponsable?: string;
  IdMovimientoPadre?: number;
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
  };
}

export interface MovimientoDetails {
  IdMovimiento: number;
  HistorialMovimientoxEstado: {
    IdHistorialMxE: number,
    FechaHistorialMxE: Date,
    Estado: {
      IdEstado: number,
      Descripcion: string
    }
  }[];
  Documento: {
    IdDocumento: number;
    CodigoReferenciaDoc: string;
    Asunto: string;
    Folios: number;
    Visible: boolean;
    TipoDocumento: {
      Descripcion: string;
      IdTipoDocumento: number;
    };
  };
  AreaDestino: {
    IdArea: number;
    Descripcion: string;
  };
  AreaOrigen: {
    IdArea: number;
    Descripcion: string;
  };
  Motivo: string;
  Acciones: string
  FechaMovimiento: Date;
  NombreResponsable: string;

  Tramite: {
    IdTramite: number;
    CodigoReferenciaTram: string;
    Descripcion: string;
    FechaInicio: Date;
    FechaFin: Date;
    Remitente: {
      IdUsuario: number;
      Nombres: string;
      ApellidoPaterno: string;
      ApellidoMaterno: string;
      NroIdentificacion: string;
    };
    TipoTramite: {
      Descripcion: string;
      IdTipoTramite: number;
    };
    Estado: {
      Descripcion: string;
      IdEstado: number;
    };
  };
}

export interface MovimientoSeguimiento {
  IdMovimiento: number;
  HistorialMovimientoxEstado: {
    IdHistorialMxE: number,
    FechaHistorialMxE: Date,
    Estado: {
      IdEstado: number,
      Descripcion: string
    }
  }[];
  Documento: {
    IdDocumento: number;
    CodigoReferenciaDoc: string;
    Asunto: string;
    Folios: number;
    Visible: boolean;
    TipoDocumento: {
      Descripcion: string;
      IdTipoDocumento: number;
    };
  };
  AreaDestino: {
    IdArea: number;
    Descripcion: string;
  };
  AreaOrigen: {
    IdArea: number;
    Descripcion: string;
  };
  Motivo: string;
  Acciones: string
  FechaMovimiento: Date;
  NombreResponsable: string;

  Tramite: {
    IdTramite: number;
    CodigoReferenciaTram: string;
    Descripcion: string;
    FechaInicio: Date;
    FechaFin: Date;
    Remitente: {
      IdUsuario: number;
      Nombres: string;
      ApellidoPaterno: string;
      ApellidoMaterno: string;
      NroIdentificacion: string;
    };
    TipoTramite: {
      Descripcion: string;
      IdTipoTramite: number;
    };
    Estado: {
      Descripcion: string;
      IdEstado: number;
    };
  };


}
