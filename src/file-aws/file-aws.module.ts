import { Module } from '@nestjs/common';
import { FileAwsService } from './file-aws.service';
import { FileAwsController } from './file-aws.controller';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { AreaService } from 'src/area/area.service';

@Module({
  controllers: [FileAwsController],
  providers: [FileAwsService, AreaService, TipoDocumentoService],
})
export class FileAwsModule { }
