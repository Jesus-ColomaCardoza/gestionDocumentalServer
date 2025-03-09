import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {extname, join} from 'path';
import { diskStorage } from 'multer';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: join(configService.get('config.filesOnboardingPath'), 'documentos'), 
          filename: (req, file, cb) => {
            const fileExtName = extname(file.originalname);
            const randomName =Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${randomName}${fileExtName}`);
          },
        }),
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
