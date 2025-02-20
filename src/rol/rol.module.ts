import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';

@Module({
  controllers: [RolController],
  providers: [RolService, PrismaService,FiltersService],
})
export class RolModule {}
