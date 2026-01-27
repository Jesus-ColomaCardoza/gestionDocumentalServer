import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: join(
            __dirname,
            '../../../',
            configService.get('config.filesSgdFolder'),
            'documentos',
          ),
          filename: (req, file, cb) => {
            const fileExtName = extname(file.originalname);
            const randomName =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${randomName}${fileExtName}`);
          },
        }),

        fileFilter: (req, file, cb) => {
          if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed!'), false);
          }
          cb(null, true);
        },
        
        limits: {
          fileSize: 20 * 1024 * 1024, // 2MB en bytes
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
