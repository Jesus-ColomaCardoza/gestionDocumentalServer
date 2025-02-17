import { Module } from '@nestjs/common';
import { TipoDocumentoService } from './tipo-documento.service';
import { TipoDocumentoController } from './tipo-documento.controller';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';

@Module({
  controllers: [TipoDocumentoController],
  providers: [TipoDocumentoService, PrismaService, FiltersService],
})
export class TipoDocumentoModule {}
