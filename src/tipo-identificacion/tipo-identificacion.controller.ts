import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TipoIdentificacionService } from './tipo-identificacion.service';
import { CreateTipoIdentificacionDto } from './dto/create-tipo-identificacion.dto';
import { UpdateTipoIdentificacionDto } from './dto/update-tipo-identificacion.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TipoIdentificacion } from '@prisma/client';

@Controller('tipo_identificacion')
@ApiTags('tipo_identificacion')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class TipoIdentificacionController {
  constructor(private readonly tipoIdentificacionService: TipoIdentificacionService) { }

  @Post('create')
  create(@Body() createTipoIdentificacionDto: CreateTipoIdentificacionDto,
    @Req() request?: Request,
  ): Promise<TipoIdentificacion> {
    return this.tipoIdentificacionService.create(createTipoIdentificacionDto, request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto): Promise<TipoIdentificacion> {
    return this.tipoIdentificacionService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<TipoIdentificacion> {
    return this.tipoIdentificacionService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTipoIdentificacionDto: UpdateTipoIdentificacionDto,
    @Req() request?: Request,
  ): Promise<TipoIdentificacion> {
    return this.tipoIdentificacionService.update(+id, updateTipoIdentificacionDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<TipoIdentificacion> {
    return this.tipoIdentificacionService.remove(+id);
  }
}
