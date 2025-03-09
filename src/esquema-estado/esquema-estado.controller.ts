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
import { EsquemaEstadoService } from './esquema-estado.service';
import { CreateEsquemaEstadoDto } from './dto/create-esquema-estado.dto';
import { UpdateEsquemaEstadoDto } from './dto/update-esquema-estado.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';
import { EsquemaEstado } from '@prisma/client';
import { OutEsquemaEstadoDto, OutEsquemaEstadosDto } from './dto/out-esquema-estado.dto';

@Controller('esquema_estado')
@ApiTags('esquema_estado')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class EsquemaEstadoController {
  constructor(private readonly esquemaEstadoService: EsquemaEstadoService) {}

  @Post('create')
  create(
    @Body() createEsquemaEstadoDto: CreateEsquemaEstadoDto,
    @Req() request?: Request,
  ): Promise<OutEsquemaEstadoDto> {
    return this.esquemaEstadoService.create(createEsquemaEstadoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutEsquemaEstadosDto> {
    return this.esquemaEstadoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutEsquemaEstadoDto> {
    return this.esquemaEstadoService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateEsquemaEstadoDto: UpdateEsquemaEstadoDto,
    @Req() request?: Request,
  ): Promise<OutEsquemaEstadoDto> {
    return this.esquemaEstadoService.update(
      +id,
      updateEsquemaEstadoDto,
      request,
    );
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutEsquemaEstadoDto> {
    return this.esquemaEstadoService.remove(+id);
  }
}
