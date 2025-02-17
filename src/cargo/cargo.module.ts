import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { FiltersService } from 'src/filters/filters.service';
import { PrismaService } from 'src/connection/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CargoController],
  providers: [CargoService, FiltersService, PrismaService, ConfigService],
})
export class CargoModule {}
