import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { DocumentoController } from './documento.controller';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { TramiteService } from 'src/tramite/tramite.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';
import { CarpetaService } from 'src/carpeta/carpeta.service';
import { Helpers } from 'src/utils/helpers';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [DocumentoController],
  providers: [
    DocumentoService,
    TipoDocumentoService,
    TramiteService,
    UsuarioService,
    TipoTramiteService,
    EstadoService,
    TipoUsuarioService,
    TipoIdentificacionService,
    RolService,
    CargoService,
    EsquemaEstadoService,
    AreaService,
    CarpetaService,
    MailService,
    Helpers
  ],
})
export class DocumentoModule { }
