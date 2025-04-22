import { Injectable } from '@nestjs/common';
import { Menssage } from 'src/menssage/menssage.entity';
import { promisify } from 'util';
import { exec } from 'child_process';
import path, { extname } from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { OutFileDto } from './dto/out-file.dto';
import { RemoveFileDto } from './dto/remove-file.dto';

@Injectable()
export class FileService {
  private message = new Menssage();
  private subPath = 'documentos';

  constructor(private configEnv: ConfigService) {}

  async create(file: Express.Multer.File): Promise<OutFileDto> {
    try {
      if (file.filename && file.path) {
        this.message.setMessage(0, 'File - Registro creado');
        return {
          message: this.message,
          registro: {
            ...file,
            parseoriginalname: path.parse(file.originalname).name,
            url: await this.traerRuta(file.filename, this.subPath),
          },
        };
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

  async remove(removeFileDto: RemoveFileDto): Promise<OutFileDto> {
    try {
      const basePublicUrl = this.obtenerAmbiente();

      const relativePath = removeFileDto.PublicUrl.replace(
        basePublicUrl,
        ' ',
      ).replace(/ /g, '');

      const fullPath = path.join(
        __dirname,
        '../../../',
        this.configEnv.get('config.filesSgdFolder'),
        relativePath,
      );

      // console.log(fullPath);

      // Verificamos si el archivo existe
      await fs.access(fullPath);

      // Eliminamos el archivo
      await fs.unlink(fullPath);

      this.message.setMessage(0, 'File - Registro eliminado');
      return { message: this.message };
    } catch (error: any) {
      // Si el error es que el archivo no existe
      if (error.code === 'ENOENT') {
        this.message.setMessage(1, 'Este File no existe');
      } else {
        this.message.setMessage(1, error.message);
      }
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

      const basePath = path.join(
        __dirname,
        '../../../',
        this.configEnv.get('config.filesSgdFolder'),
        nombreCarpeta,
      );
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
        UrlBase: basePath,
        Url: await this.traerRuta(nombreCompletoArchivo, nombreCarpeta),
        Nombre: nombreCompletoArchivo,
      };
    } catch (error) {
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  obtenerAmbiente(): string {
    return `${this.configEnv.get('config.filesSgdUrl')}`;
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
