import { Module } from '@nestjs/common';
import { ArchivadorService } from './archivador.service';
import { ArchivadorController } from './archivador.controller';
import { FiltersService } from 'src/filters/filters.service';
import { PrismaService } from 'src/connection/prisma.service';


@Module({
  controllers: [ArchivadorController],
  providers: [ArchivadorService, FiltersService, PrismaService],
})
export class ArchivadorModule {}
