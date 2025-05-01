import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { Helpers } from 'src/utils/helpers';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MailController],
  providers: [MailService,Helpers,JwtService],
})
export class MailModule {}
