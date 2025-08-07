import { Module } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';
import { AreaService } from 'src/area/area.service';
import { TramiteService } from 'src/tramite/tramite.service';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { EsquemaEstadoService } from 'src/esquema-estado/esquema-estado.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';

@Module({
  controllers: [MovimientoController],
  providers: [
    MovimientoService,
    AreaService,
    TramiteService,
    TipoTramiteService,
    EstadoService,
    UsuarioService,
    EsquemaEstadoService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    TipoDocumentoService
  ],
})
export class MovimientoModule {}
