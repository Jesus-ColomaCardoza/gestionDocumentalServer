import { Module } from '@nestjs/common';
import { EsquemaEstadoService } from './esquema-estado.service';
import { EsquemaEstadoController } from './esquema-estado.controller';

@Module({
  controllers: [EsquemaEstadoController],
  providers: [EsquemaEstadoService],
})
export class EsquemaEstadoModule {}
