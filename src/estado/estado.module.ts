import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService, EsquemaEstadoService],
})
export class EstadoModule {}
