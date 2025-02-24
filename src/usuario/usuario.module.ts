import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TipoIdentificacionService } from 'src/tipo-identificacion/tipo-identificacion.service';
import { TipoUsuarioService } from 'src/tipo-usuario/tipo-usuario.service';
import { RolService } from 'src/rol/rol.service';
import { CargoService } from 'src/cargo/cargo.service';
import { AreaService } from 'src/area/area.service';

@Module({
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    TipoIdentificacionService,
    TipoUsuarioService,
    RolService,
    CargoService,
    AreaService,
  ],
})
export class UsuarioModule {}
