import { Module } from '@nestjs/common';
import { FileAwsService } from './file-aws.service';
import { FileAwsController } from './file-aws.controller';

@Module({
  controllers: [FileAwsController],
  providers: [FileAwsService],
})
export class FileAwsModule {}
