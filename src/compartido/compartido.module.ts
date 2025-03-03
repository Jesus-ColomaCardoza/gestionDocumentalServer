import { Module } from '@nestjs/common';
import { CompartidoService } from './compartido.service';
import { CompartidoController } from './compartido.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AreaService } from 'src/area/area.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { DocumentoService } from 'src/documento/documento.service';
import { CarpetaService } from 'src/carpeta/carpeta.service';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { TramiteService } from 'src/tramite/tramite.service';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';

@Module({
  controllers: [CompartidoController],
  providers: [
    CompartidoService,
    UsuarioService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    AreaService,
    DocumentoService,
    CarpetaService,
    TipoDocumentoService,
    TramiteService,
    TipoTramiteService,
    EstadoService,
    EsquemaEstadoService
  ],
})
export class CompartidoModule {}
