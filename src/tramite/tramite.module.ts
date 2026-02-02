import { Module } from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { TramiteController } from './tramite.controller';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { MailService } from 'src/mail/mail.service';
import { Helpers } from 'src/utils/helpers';

@Module({
  controllers: [TramiteController],
  providers: [
    TramiteService,
    TipoTramiteService,
    EstadoService,
    UsuarioService,
    EsquemaEstadoService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    AreaService,
    TipoDocumentoService,
    MailService,
    Helpers
  ],
})
export class TramiteModule { }
