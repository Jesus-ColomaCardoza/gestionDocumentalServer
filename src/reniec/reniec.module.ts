import { Module } from '@nestjs/common';
import { ReniecService } from './reniec.service';
import { ReniecController } from './reniec.controller';
import { JwtService } from '@nestjs/jwt';
import { Helpers } from 'src/utils/helpers';

@Module({
  controllers: [ReniecController],
  providers: [ReniecService,Helpers,JwtService],
})
export class ReniecModule {}
