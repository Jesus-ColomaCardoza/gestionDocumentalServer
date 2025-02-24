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
import { RolModule } from './rol/rol.module';
import { TipoUsuarioModule } from './tipo-usuario/tipo-usuario.module';
import { EstadoModule } from './estado/estado.module';
import { EsquemaEstadoModule } from './esquema-estado/esquema-estado.module';
import { FiltersService } from './filters/filters.service';
import { FiltersModule } from './filters/filters.module';
import { PrismaService } from './connection/prisma.service';
import { PrismaModule } from './connection/prisma.module';
import { AreaModule } from './area/area.module';
import { MovimientoModule } from './movimiento/movimiento.module';
import { TramiteModule } from './tramite/tramite.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TipoTramiteModule } from './tipo-tramite/tipo-tramite.module';
import { TipoIdentificacionModule } from './tipo-identificacion/tipo-identificacion.module';

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
    RolModule,
    TipoUsuarioModule,
    EstadoModule,
    EsquemaEstadoModule,
    FiltersModule,
    PrismaModule,
    TipoTramiteModule,
    TipoIdentificacionModule,
    AreaModule,
    MovimientoModule,
    TramiteModule,
    UsuarioModule
  ],
  controllers: [AppController],
  providers: [AppService,FiltersService,PrismaService],
})
export class AppModule {}
