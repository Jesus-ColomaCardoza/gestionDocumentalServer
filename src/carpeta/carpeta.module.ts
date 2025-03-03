import { Module } from '@nestjs/common';
import { CarpetaService } from './carpeta.service';
import { CarpetaController } from './carpeta.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';

@Module({
  controllers: [CarpetaController],
  providers: [CarpetaService,
    UsuarioService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    AreaService
  ],
})
export class CarpetaModule {}
