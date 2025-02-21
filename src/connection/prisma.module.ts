import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/connection/prisma.service';

@Global()
@Module({
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
