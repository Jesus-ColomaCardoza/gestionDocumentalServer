import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Menssage } from 'src/menssage/menssage.entity';

@Catch(MulterError, Error)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message = new Menssage();
    let status = HttpStatus.OK;
    let messageText = exception.message;
    // console.log(exception);

    if (messageText === 'File too large') {
      message.setMessage(1, 'El archivo excede el tamaño máximo de 20MB.');
    } else if (messageText === 'Only PDF files are allowed!') {
      message.setMessage(1, 'Solo se permiten archivos PDF.');
    } else {
      message.setMessage(1, 'Error al cargar el archivo.');
    }

    response.status(status).json({ message, registro: null });
  }
}
