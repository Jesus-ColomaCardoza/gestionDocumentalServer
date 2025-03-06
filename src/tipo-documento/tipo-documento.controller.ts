import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TipoDocumentoService } from './tipo-documento.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TipoDocumento } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';

@Controller('tipo_documento')
@ApiTags('tipo_documento')
// @UseGuards(AuthGuard)
// @ApiBearerAuth() 
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) { }

  @Post('create')
  create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto,
    @Req() request?: Request,
  ): Promise<TipoDocumento> {
    return this.tipoDocumentoService.create(createTipoDocumentoDto, request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto): Promise<TipoDocumento> {
    return this.tipoDocumentoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<TipoDocumento> {
    return this.tipoDocumentoService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto,
    @Req() request?: Request,
  ): Promise<TipoDocumento> {
    return this.tipoDocumentoService.update(+id, updateTipoDocumentoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<TipoDocumento> {
    return this.tipoDocumentoService.remove(+id);
  }
}
