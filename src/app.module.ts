import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CargoModule } from './cargo/cargo.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { CompartidoModule } from './compartido/compartido.module';
import { DocumentoModule } from './documento/documento.module';
import { RegistroFirmaModule } from './registro-firma/registro-firma.module';
import { EmpresaModule } from './empresa/empresa.module';
import { CarpetaModule } from './carpeta/carpeta.module';
import { FileModule } from './file/file.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { MailModule } from './mail/mail.module';
import { ConstanteModule } from './constante/constante.module';
import { AnexoModule } from './anexo/anexo.module';
import { ArchivadorModule } from './archivador/archivador.module';
import { AwsModule } from './aws/aws.module';
import { FileAwsModule } from './file-aws/file-aws.module';
import { ReniecModule } from './reniec/reniec.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      serveRoot: '/public',
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(
            __dirname,
            '../..',
            configService.get('config.filesSgdFolder'),
          ),
          serveRoot: `/${configService.get('config.filesSgdFolder')}`,
        },
      ],
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
    UsuarioModule,
    CompartidoModule,
    DocumentoModule,
    RegistroFirmaModule,
    EmpresaModule,
    CarpetaModule,
    FileModule,
    FileManagerModule,
    MailModule,
    ConstanteModule,
    AnexoModule,
    ArchivadorModule,
    AwsModule,
    FileAwsModule,
    ReniecModule
  ],
  controllers: [AppController],
  providers: [AppService, FiltersService],
})
export class AppModule {}
