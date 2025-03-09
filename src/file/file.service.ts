import { Injectable } from '@nestjs/common';
import { Menssage } from 'src/menssage/menssage.entity';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private message = new Menssage();

  constructor(private configEnv: ConfigService) {}

  async create(file: Express.Multer.File) {
    try {
      if (file.filename && file.path) {
        this.message.setMessage(0, 'File - Registro creado');
        return { message: this.message, registro: file};
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
      
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async guardarDocumento(
    base64: string,
    nombreCarpeta: string,
    nombreArchivo: string,
  ): Promise<any> {
    try {
      const nombreFechaHora = new Date();
      const fechaHoraString = nombreFechaHora
        .toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        .replace(/[/,: ]/g, '');

      const nombreCompletoArchivo = `${fechaHoraString}_${nombreArchivo}`;
      let byteArray: Buffer;
      byteArray = Buffer.from(base64, 'base64');

      const basePath = `${this.configEnv.get('config.filesOnboardingPath')}\\${nombreCarpeta}`;
      const ruta = path.resolve(basePath);

      // Crear directorio si no existe
      await fs.mkdir(ruta, { recursive: true });

      const pathFile = path.join(ruta, nombreCompletoArchivo);

      // Escribir el archivo
      await fs.writeFile(pathFile, byteArray);

      // Configurar permisos (específico de Windows)
      const grupo = 'Todos';
      const icaclsCommand = `icacls "${ruta}" /grant ${grupo}:(OI)(CI)M /T`;

      const execAsync = promisify(exec);
      const { stdout, stderr } = await execAsync(icaclsCommand);

      return {
        UrlBase: path.join(
          this.configEnv.get('config.filesOnboardingPath'),
          nombreCarpeta,
        ),
        Url: await this.traerRuta(nombreCompletoArchivo, nombreCarpeta),
        Nombre: nombreCompletoArchivo,
      };
    } catch (error) {
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  obtenerAmbiente(): string {
    return `${this.configEnv.get('config.filesOnboardingUrl')}`;
  }

  async traerRuta(nombreArchivo: string, carpeta: string): Promise<string> {
    try {
      const basePath = this.obtenerAmbiente();
      const ruta = `${basePath}/${carpeta}/${nombreArchivo}`;
      return ruta.replace(/\\/g, '/');
    } catch (error) {
      console.error('Error en traerRuta:', error);
      throw error;
    }
  }

  async eliminarDocumento(url: string): Promise<any> {
    try {
      // eliminar el archivo
      await fs.unlink(url);
    } catch (error) {
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }
}
