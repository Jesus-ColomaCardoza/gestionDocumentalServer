import { Module } from '@nestjs/common';
import { RegistroFirmaService } from './registro-firma.service';
import { RegistroFirmaController } from './registro-firma.controller';
import { DocumentoService } from 'src/documento/documento.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { TramiteService } from 'src/tramite/tramite.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';
import { CarpetaService } from 'src/carpeta/carpeta.service';

@Module({
  controllers: [RegistroFirmaController],
  providers: [
    RegistroFirmaService,
    TipoDocumentoService,
    DocumentoService,
    UsuarioService,
    TramiteService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    TipoTramiteService,
    AreaService,
    EstadoService,
    EsquemaEstadoService,
    CarpetaService
  ],
})
export class RegistroFirmaModule {}
