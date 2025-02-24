import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Usuario } from '@prisma/client';

@Controller('usuario')
@ApiTags('usuario')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('create')
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() request: Request,
  ): Promise<Usuario> {
    return this.usuarioService.create(createUsuarioDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<Usuario> {
    return this.usuarioService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() request: Request,
  ): Promise<Usuario> {
    return this.usuarioService.update(+id, updateUsuarioDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.remove(+id);
  }
}
