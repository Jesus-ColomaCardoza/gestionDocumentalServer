import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { FiltersService } from 'src/filters/filters.service';
import { PrismaService } from 'src/connection/prisma.service';


@Module({
  controllers: [CargoController],
  providers: [CargoService, FiltersService, PrismaService],
})
export class CargoModule {}
