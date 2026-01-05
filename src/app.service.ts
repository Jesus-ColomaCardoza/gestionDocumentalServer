import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AdmZip from 'adm-zip';

@Injectable()
export class AppService {

  constructor(
    private configEnv: ConfigService,
  ) { }

  getHello(): any {
    return {
      environment: this.configEnv.get('config.serverEnv'),
      message: 'Welcome to the API SGD',
    };
  }

  async descargarPdfDesdeBase64Zip(
    base64Zip: string,
    response: any
  ): Promise<void> {
    // 1. Decodificar Base64
    const zipBuffer = Buffer.from(base64Zip, 'base64');

    // 2. Abrir ZIP
    const zip = new AdmZip(zipBuffer);

    // 3. Buscar PDF
    const pdfEntry = zip.getEntries()
      .find(entry => !entry.isDirectory && entry.name.endsWith('.pdf'));

    if (!pdfEntry) {
      throw new Error('No hay PDF en el ZIP');
    }

    // 4. Configurar respuesta
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${pdfEntry.name}"`);

    // 5. Enviar PDF
    response.send(pdfEntry.getData());

  }
}
