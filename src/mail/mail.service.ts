import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

import { Menssage } from 'src/menssage/menssage.entity';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';
import { Mail } from './entities/mail.entity';
import { TestMailDto } from './dto/test-mail.dto';
import { ITramiteExterno2Mail } from 'src/tramite/interfaces/tramite.interface';
import { printLog } from 'src/utils/utils';

@Injectable()
export class MailService {
  private message = new Menssage();

  constructor(
    private configEnv: ConfigService,
    private helpers: Helpers,
  ) { }

  async sendTramiteExterno2(tramiteExterno2Mail: ITramiteExterno2Mail) {
    try {
      let correosToSend = [tramiteExterno2Mail.Remitente.Email];

      let secure: boolean = false;

      let subject: string = '';

      if (this.configEnv.get('config.serverEnv') == 'local') {
      } else if (this.configEnv.get('config.serverEnv') == 'development') {
        subject = 'Pruebas DEV - ';
      } else if (this.configEnv.get('config.serverEnv') == 'quality') {
        subject = 'Pruebas QAS - ';
      } else if (this.configEnv.get('config.serverEnv') == 'production') {
        secure = true;
      }

      let transporter = nodemailer.createTransport({
        //Host: can be your own domain or others provider like: hostinger, goDaddy, aws,etc.
        host: `${this.configEnv.get('config.mailHost')}`,
        //Port: depend of your seeting email or your provider(search smtp port)
        port: this.configEnv.get('config.mailPort'), // o 465 si usas SSL
        //False
        secure: secure,
        //Credentials in your mail or provider
        auth: {
          user: `${this.configEnv.get('config.mailUser')}`,
          pass: `${this.configEnv.get('config.mailPassword')}`,
        },
      });

      console.log(`${this.configEnv.get('config.mailHost')}`);

      let info = await transporter.sendMail({
        // Remitente
        from: `"${'SIGED FAIQUE - Trámite Externo'}: " <${this.configEnv.get('config.mailUser')}>`,
        // Destinatarios  list
        to: correosToSend, //cliente,
        // Subject
        subject: `${subject}Registro de támite externo`,
        // Message body
        html: this.templateHtmlTramiteExterno(tramiteExterno2Mail),
      });

      console.log(info);

      if (info.messageId) {
        this.message.setMessage(0, 'Mail - Enviado con éxito');
        return { message: this.message };
      } else {
        this.message.setMessage(1, 'Error: Mail - No se envió');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  templateHtmlTramiteExterno(tramiteExterno2Mail: ITramiteExterno2Mail): string {
    printLog(tramiteExterno2Mail);
    const htmlTemplatePath = path.join(
      __dirname,
      '../../../public/html',
      'tramite-externo2.html',
    );
    let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');

    htmlContent = htmlContent.replaceAll(
      '{{IdTramite}}',
      tramiteExterno2Mail.IdTramite.toString().padStart(8, '0'),
    );
    htmlContent = htmlContent.replaceAll(
      '{{FechaInicio}}',
      tramiteExterno2Mail?.FechaInicio ? this.helpers.formatDate(tramiteExterno2Mail?.FechaInicio)
        : "--:--:--",
    );
    htmlContent = htmlContent.replaceAll(
      '{{Asunto}}',
      tramiteExterno2Mail?.Documento?.Asunto,
    );
    htmlContent = htmlContent.replaceAll(
      '{{Folios}}',
      tramiteExterno2Mail?.Documento?.Folios.toString(),
    );
    htmlContent = htmlContent.replaceAll(
      '{{TipoTramite}}',
      tramiteExterno2Mail?.TipoTramite?.Descripcion.toString(),
    );
    htmlContent = htmlContent.replaceAll(
      '{{Remitente}}',
      tramiteExterno2Mail.Remitente.NroIdentificacion + ' | ' + tramiteExterno2Mail?.Remitente.Nombres.toString() + ' ' + tramiteExterno2Mail?.Remitente.ApellidoPaterno.toString() + ' ' + tramiteExterno2Mail?.Remitente.ApellidoMaterno.toString(),
    );
    htmlContent = htmlContent.replaceAll(
      '{{Area}}',
      tramiteExterno2Mail.Area.Descripcion,
    );
    htmlContent = htmlContent.replaceAll(
      '{{CodigoReferenciaDoc}}',
      tramiteExterno2Mail.Documento.CodigoReferenciaDoc
    );

    return htmlContent;
  }

  async sendCodigoConfirmacion(cuentaToNotify: {
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Email: string;
    UrlResetPassword: string;
  }) {
    try {
      let correosToSend = [cuentaToNotify.Email];

      let secure: boolean = false;

      let subject: string = '';

      if (this.configEnv.get('config.serverEnv') == 'local') {
      } else if (this.configEnv.get('config.serverEnv') == 'development') {
        subject = 'Pruebas DEV - ';
      } else if (this.configEnv.get('config.serverEnv') == 'quality') {
        subject = 'Pruebas QAS - ';
      } else if (this.configEnv.get('config.serverEnv') == 'production') {
        secure = true;
      }

      let transporter = nodemailer.createTransport({
        //Host: can be your own domain or others provider like: hostinger, goDaddy, aws,etc.
        host: `${this.configEnv.get('config.mailHost')}`,
        //Port: depend of your seeting email or your provider(search smtp port)
        port: this.configEnv.get('config.mailPort'), // o 465 si usas SSL
        //False
        secure: secure,
        //Credentials in your mail or provider
        auth: {
          user: `${this.configEnv.get('config.mailUser')}`,
          pass: `${this.configEnv.get('config.mailPassword')}`,
        },
      });

      console.log(`${this.configEnv.get('config.mailHost')}`);

      let info = await transporter.sendMail({
        // Remitente
        from: `"${'Recuperación de cuenta'}: " <${this.configEnv.get('config.mailUser')}>`,
        // Destinatarios  list
        to: correosToSend, //cliente,
        // Subject
        subject: `${subject}Verificación de Correo`,
        // Message body
        html: this.templateHtmlCodigoConfirmacion(cuentaToNotify),
      });

      console.log(info);

      if (info.messageId) {
        this.message.setMessage(0, 'Mail - Enviado con éxito');
        return { message: this.message };
      } else {
        this.message.setMessage(1, 'Error: Mail - No se envió');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  templateHtmlCodigoConfirmacion(cuentaToNotify: {
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Email: string;
    UrlResetPassword: string;
  }): string {
    const htmlTemplatePath = path.join(
      __dirname,
      '../../../public/html',
      'codigo-confirmacion.html',
    );
    let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');

    htmlContent = htmlContent.replaceAll(
      '{{Nombres}}',
      cuentaToNotify.Nombres.toUpperCase(),
    );
    htmlContent = htmlContent.replaceAll(
      '{{ApellidoPaterno}}',
      cuentaToNotify.ApellidoPaterno.toUpperCase(),
    );
    htmlContent = htmlContent.replaceAll(
      '{{ApellidoMaterno}}',
      cuentaToNotify.ApellidoMaterno.toUpperCase(),
    );
    htmlContent = htmlContent.replace(
      '{{UrlResetPassword}}',
      cuentaToNotify.UrlResetPassword,
    );

    return htmlContent;
  }

  async sendMailtest(testMailDto: TestMailDto) {
    try {
      let correosToSend = [testMailDto.Mail];

      let secure: boolean = false;

      let subject: string = '';

      if (this.configEnv.get('config.serverEnv') == 'local') {
      } else if (this.configEnv.get('config.serverEnv') == 'development') {
        subject = 'Pruebas DEV - ';
      } else if (this.configEnv.get('config.serverEnv') == 'quality') {
        subject = 'Pruebas QAS - ';
      } else if (this.configEnv.get('config.serverEnv') == 'production') {
        secure = true;
      }

      let transporter = nodemailer.createTransport({
        //Host: can be your own domain or others provider like: hostinger, goDaddy, aws,etc.
        host: `${this.configEnv.get('config.mailHost')}`,
        //Port: depend of your seeting email or your provider(search smtp port)
        port: this.configEnv.get('config.mailPort'), // o 465 si usas SSL
        //False
        secure: secure,
        //Credentials in your mail or provider
        auth: {
          user: `${this.configEnv.get('config.mailUser')}`,
          pass: `${this.configEnv.get('config.mailPassword')}`,
        },
      });

      console.log(`${this.configEnv.get('config.mailHost')}`);

      let info = await transporter.sendMail({
        // Remitente
        from: `"Test SGD mails: " <${this.configEnv.get('config.mailUser')}>`,
        // Destinatarios  list
        to: correosToSend, //cliente,
        // Subject
        subject: `Test SGD mails`,
        // Message body
        html: this.templateHtmlMailTest(testMailDto.Mail),
      });

      console.log(info);

      if (info.messageId) {
        this.message.setMessage(0, 'Mail - Enviado con éxito');
        return { message: this.message };
      } else {
        this.message.setMessage(1, 'Error: Mail - No se envió');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  templateHtmlMailTest(cuentaToNotify: string): string {
    const htmlTemplatePath = path.join(
      __dirname,
      '../../../public/html',
      'test-mail.html',
    );
    let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');

    htmlContent = htmlContent.replaceAll('{{CuentaToNotify}}', cuentaToNotify);

    return htmlContent;
  }
}
