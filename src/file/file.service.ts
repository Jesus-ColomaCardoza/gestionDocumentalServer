import { Injectable } from '@nestjs/common';
import { Menssage } from 'src/menssage/menssage.entity';
import { promisify } from 'util';
import { exec } from 'child_process';
import path, { extname } from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { OutFileDto } from './dto/out-file.dto';
import { RemoveFileDto } from './dto/remove-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from 'src/connection/prisma.service';
import { printLog } from 'src/utils/utils';
import AdmZip from 'adm-zip';
import axios from 'axios';


@Injectable()
export class FileService {
  private message = new Menssage();
  private subPath = 'documentos';

  constructor(
    private configEnv: ConfigService,
    private prisma: PrismaService
  ) { }

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

  async update(file: Express.Multer.File, data: UpdateFileDto): Promise<OutFileDto> {
    // Promise<any> {
    try {
      printLog(file)

      if (file.filename && file.path) {
        const documentoFound = await this.prisma.documento.findUnique({
          where: { IdDocumento: +data.IdDocumento },
        });

        if (!documentoFound) {
          this.message.setMessage(1, 'Error: File - Registro no encontrado');
          return { message: this.message };
        }

        const firmar = data.Firmar == "true" ? true : false

        if (firmar) {
          try {
            // Leer el archivo PDF
            const pdfBuffer = await fs.readFile(file.path);

            // Crear ZIP con el PDF
            const zip = new AdmZip();

            // Nombre del archivo dentro del ZIP (puedes personalizarlo)
            zip.addFile(`documento_firmado_${Date.now()}.pdf`, pdfBuffer);

            // Generar ZIP como buffer
            const zipBuffer = zip.toBuffer();

            // Convertir a base64
            const zipBase64 = zipBuffer.toString('base64');

            //Enviar a servicio externo de firma
            const documentoFirmado = await axios.post<{
              success: boolean,
              zip_base64: string
            }>(`${this.configEnv.get('config.watanaFirmadorUrl')}`,
              {
                operacion: 'firmar_pdf',
                sello_de_tiempo: true,
                zip_base64: zipBase64
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${this.configEnv.get('config.watanaFirmadorKey')}`
                },
              }
            );

            if (documentoFirmado.data.success) {
              // Eliminamos el archivo de entrada
              await fs.unlink(file.path);

              // Decodificar Base64
              const zipBuffer = Buffer.from(documentoFirmado.data.zip_base64, 'base64');

              // Abrir ZIP
              const zip = new AdmZip(zipBuffer);

              // Buscar PDF
              const pdfEntry = zip.getEntries()
                .find(entry => !entry.isDirectory && entry.name.endsWith('.pdf'));

              if (!pdfEntry) {
                throw new Error('No hay PDF en el ZIP');
              }

              const buffer = pdfEntry.getData();

              await fs.writeFile(file.path, buffer);
            } else {
              this.message.setMessage(1, 'Error: File - Registro no actualizado');
              return { message: this.message };
            }
          } catch (error) {
            printLog(error);
            this.message.setMessage(1, error.message);
            return { message: this.message };
          }
        }

        const documentoUpdate = await this.prisma.documento.update({
          where: { IdDocumento: +data.IdDocumento },
          data: {
            NombreDocumento: file.filename,
            UrlDocumento: await this.traerRuta(file.filename, this.subPath),
            SizeDocumento: file.size,
            UrlBase: file.path,
            ...firmar && {
              IdEstado: 3 // Firmado
            },
          },
        });

        if (documentoUpdate) {
          this.remove({ PublicUrl: documentoFound.UrlDocumento });

          this.message.setMessage(0, 'File - Registro actualizado');

          return {
            message: this.message,
            registro: {
              ...file,
              parseoriginalname: path.parse(file.originalname).name,
              url: await this.traerRuta(file.filename, this.subPath),
            },
          };
        } else {
          this.message.setMessage(1, 'Error: File - Registro no actualizado');
          return { message: this.message };
        }

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
        this.message.setMessage(0, 'Este File no existe');
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
