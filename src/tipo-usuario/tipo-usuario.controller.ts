import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TipoUsuarioService } from './tipo-usuario.service';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';
import { ApiTags } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';

@Controller('tipo_usuario')
@ApiTags('tipo_usuario')
// @UseGuards(AuthGuard)
// @ApiBearerAuth() 
export class TipoUsuarioController {
  constructor(private readonly tipoUsuarioService: TipoUsuarioService) { }

  @Post('create')
  create(@Body() createTipoUsuarioDto: CreateTipoUsuarioDto,
    @Req() request: Request,
  ): Promise<TipoUsuario> {
    return this.tipoUsuarioService.create(createTipoUsuarioDto, request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto): Promise<TipoUsuario> {
    return this.tipoUsuarioService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<TipoUsuario> {
    return this.tipoUsuarioService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTipoUsuarioDto: UpdateTipoUsuarioDto,
    @Req() request: Request,
  ): Promise<TipoUsuario> {
    return this.tipoUsuarioService.update(+id, updateTipoUsuarioDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<TipoUsuario> {
    return this.tipoUsuarioService.remove(+id);
  }
}
