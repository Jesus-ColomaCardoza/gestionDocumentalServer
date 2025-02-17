import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CargoModule } from './cargo/cargo.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TipoDocumentoModule } from './tipo-documento/tipo-documento.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      load:  [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
    }),
    CargoModule,
    AuthModule,
    TipoDocumentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
