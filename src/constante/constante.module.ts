import { Module } from '@nestjs/common';
import { ConstanteService } from './constante.service';
import { ConstanteController } from './constante.controller';
import { FiltersService } from 'src/filters/filters.service';
import { PrismaService } from 'src/connection/prisma.service';

@Module({
  controllers: [ConstanteController],
  providers: [ConstanteService, FiltersService, PrismaService],
})
export class ConstanteModule {}
