import { Module } from '@nestjs/common';
import { TipoTramiteService } from './tipo-tramite.service';
import { TipoTramiteController } from './tipo-tramite.controller';

@Module({
  controllers: [TipoTramiteController],
  providers: [TipoTramiteService],
})
export class TipoTramiteModule {}
