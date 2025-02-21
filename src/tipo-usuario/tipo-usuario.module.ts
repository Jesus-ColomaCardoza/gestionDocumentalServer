import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipo-usuario.service';
import { TipoUsuarioController } from './tipo-usuario.controller';
import { PrismaService } from 'src/connection/prisma.service';

@Module({
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService,],
})
export class TipoUsuarioModule {}
