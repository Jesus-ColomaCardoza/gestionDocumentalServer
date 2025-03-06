import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TipoTramiteService } from './tipo-tramite.service';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';
import { UpdateTipoTramiteDto } from './dto/update-tipo-tramite.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TipoTramite } from '@prisma/client';

@Controller('tipo_tramite')
@ApiTags('tipo_tramite')
// @UseGuards(AuthGuard)
// @ApiBearerAuth() 
export class TipoTramiteController {
  constructor(private readonly tipoTramiteService: TipoTramiteService) { }

  @Post('create')
  create(@Body() createTipoTramiteDto: CreateTipoTramiteDto,
    @Req() request?: Request,
  ): Promise<TipoTramite> {
    return this.tipoTramiteService.create(createTipoTramiteDto, request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto): Promise<TipoTramite> {
    return this.tipoTramiteService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<TipoTramite> {
    return this.tipoTramiteService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTipoTramiteDto: UpdateTipoTramiteDto,
    @Req() request?: Request,
  ): Promise<TipoTramite> {
    return this.tipoTramiteService.update(+id, updateTipoTramiteDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<TipoTramite> {
    return this.tipoTramiteService.remove(+id);
  }
}
