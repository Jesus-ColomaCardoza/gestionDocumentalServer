import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('descargar')
  async descargar(@Body('data') base64: string, @Res() res: Response) {
    await this.appService.descargarPdfDesdeBase64Zip(base64, res);
  }
}
