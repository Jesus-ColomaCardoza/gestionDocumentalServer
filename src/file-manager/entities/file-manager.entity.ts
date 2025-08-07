export class FileManager {
    IdFM: string;
    Descripcion: string;
    FechaEmision: Date | null;
    UrlFM: string;
    FirmaDigital: boolean | null;
    Categoria?: "MF" | "FA" | "FS" | undefined;
    Size?: number;
    Activo: boolean | null;
    Usuario: {
        IdUsuario: number;
        Nombres: string;
        ApellidoPaterno: string;
        ApellidoMaterno: string;
        Area: {
            IdArea: number;
            Descripcion: string;
        };
    };
    Estado: {
        IdEstado: number;
        Descripcion: string;
    };
    Carpeta: {
        IdCarpeta: number;
        Descripcion: string;
    };
}
