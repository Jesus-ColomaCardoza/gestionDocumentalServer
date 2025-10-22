import { Global, Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';

@Global()
@Module({
  controllers: [AwsController],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule { }
