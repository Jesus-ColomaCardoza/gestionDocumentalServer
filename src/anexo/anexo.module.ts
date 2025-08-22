import { Module } from '@nestjs/common';
import { AnexoService } from './anexo.service';
import { AnexoController } from './anexo.controller';
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
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { DocumentoService } from 'src/documento/documento.service';

@Module({
  controllers: [AnexoController],
  providers: [
    AnexoService,
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
    TipoDocumentoService,
    DocumentoService
  ],
})
export class AnexoModule { }
