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
import { TramiteService } from './tramite.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Tramite } from '@prisma/client';
import { OutTramiteDto, OutTramiteEmitidoDto, OutTramitesDto, OutTramitesPendienteDto } from './dto/out-tramite.dto';
import { CreateTramiteEmitidoDto } from './dto/create-tramite-emitido.dto';
import { GetAllTramitePendienteDto } from './dto/get-all-tramite-pediente.dto';
import { RecibirTramiteDto } from './dto/recibir-tramite.dto';
import { RecibirTramiteExternoDto } from './dto/recibir-tramite-externo.dto';
import { GetAllTramiteRecibidoDto } from './dto/get-all-tramite-recibido.dto';
import { AtenderTramiteDto, DesmarcarAtenderTramiteDto } from './dto/atender-tramite.dto';
import { DesmarcarObservarTramiteDto, ObservarTramiteDto } from './dto/observar-tramite.dto';
@Controller('tramite')
@ApiTags('tramite')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService) { }

  @Post('create')
  create(
    @Body() createTramiteDto: CreateTramiteDto,
    @Req() request?: Request,
  ): Promise<OutTramiteDto> {
    return this.tramiteService.create(createTramiteDto, request);
  }

  @Post('create_emitido')
  createEmitido(
    @Body() createTramiteEmitidoDto: CreateTramiteEmitidoDto,
    @Req() request?: Request,
  ): Promise<OutTramiteEmitidoDto> {
    return this.tramiteService.createEmitido(createTramiteEmitidoDto, request);
  }

  @Post('recibir_externo')
  recibirExterno(
    @Body() recibirTramiteExternoDto: RecibirTramiteExternoDto,
    @Req() request?: Request,
  ): Promise<OutTramiteEmitidoDto> {
    return this.tramiteService.recibirExterno(recibirTramiteExternoDto, request);
  }

  @Post('recibir')
  recibir(
    @Body() recibirTramiteDto: RecibirTramiteDto,
    @Req() request?: Request,
  ): Promise<any> {
    return this.tramiteService.recibir(recibirTramiteDto, request);
  }

  @Post('atender')
  atender(
    @Body() atenderTramiteDto: AtenderTramiteDto,
    @Req() request?: Request,
  ): Promise<any> {
    return this.tramiteService.atender(atenderTramiteDto, request);
  }

  @Post('desmarcar_atender')
  desmarcarAtender(
    @Body() desmarcarAtenderTramiteDto: DesmarcarAtenderTramiteDto,
  ): Promise<any> {
    return this.tramiteService.desmarcarAtender(desmarcarAtenderTramiteDto);
  }

  @Post('observar')
  observar(
    @Body() observarTramiteDto: ObservarTramiteDto,
    @Req() request?: Request,
  ): Promise<any> {
    return this.tramiteService.observar(observarTramiteDto, request);
  }

  @Post('desmarcar_observar')
  desmarcarObservar(
    @Body() desmarcarObservarTramiteDto: DesmarcarObservarTramiteDto,
  ): Promise<any> {
    return this.tramiteService.desmarcarObservar(desmarcarObservarTramiteDto);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutTramitesDto> {
    return this.tramiteService.findAll(combinationsFiltersDto);
  }

  @Post('find_all_pendientes')
  findAllPendientes(
    @Body() getAllTramitePendienteDto: GetAllTramitePendienteDto,
  ): Promise<OutTramitesPendienteDto> {
    return this.tramiteService.findAllPendientes(getAllTramitePendienteDto);
  }

  @Post('find_all_recibidos')
  findAllRecibidos(
    @Body() getAllTramiteRecibidoDto: GetAllTramiteRecibidoDto,
  ): Promise<OutTramitesPendienteDto> {
    return this.tramiteService.findAllRecibidos(getAllTramiteRecibidoDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutTramiteDto> {
    return this.tramiteService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateTramiteDto: UpdateTramiteDto,
    @Req() request?: Request,
  ): Promise<OutTramiteDto> {
    return this.tramiteService.update(+id, updateTramiteDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutTramiteDto> {
    return this.tramiteService.remove(+id);
  }
}
