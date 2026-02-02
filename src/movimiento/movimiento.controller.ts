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
import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { OutMovimientoDetailsDto, OutMovimientoDto, OutMovimientosDetailsDto, OutMovimientosDto, OutMovimientoSeguimientoDto } from './dto/out-movimiento.dto';
import { GetSeguimientoMovimientoDto } from './dto/get-seguimiento-movimiento.dto';
import { GetSeguimiento2MovimientoDto } from './dto/get-seguimiento2-movimiento.dto';

@Controller('movimiento')
@ApiTags('movimiento')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) { }

  @Post('create')
  create(
    @Body() createMovimientoDto: CreateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    return this.movimientoService.create(createMovimientoDto, request);
  }

  @Post('create_all')
  createAll(
    @Body() createMovimientoDto: CreateMovimientoDto[],
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    return this.movimientoService.createAll(createMovimientoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutMovimientosDto> {
    return this.movimientoService.findAll(combinationsFiltersDto);
  }

  @Post('find_all_details')
  findAllDetails(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutMovimientosDetailsDto> {
    return this.movimientoService.findAllDetails(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutMovimientoDto> {
    return this.movimientoService.findOne(+id);
  }

  @Get('find_one_details/:id')
  findOneDetails(@Param('id') id: string): Promise<OutMovimientoDetailsDto> {
    return this.movimientoService.findOneDetails(+id);
  }

  @Post('find_one_seguimiento')
  findOneSeguimiento(
    @Body() getSeguimientoMovimientoDto: GetSeguimientoMovimientoDto,
  ): Promise<OutMovimientoSeguimientoDto> {
    return this.movimientoService.findOneSeguimiento(getSeguimientoMovimientoDto);
  }

  @Post('find_one_seguimiento2')
  findOneSeguimiento2(
    @Body() getSeguimiento2MovimientoDto: GetSeguimiento2MovimientoDto,
  ): Promise<OutMovimientoSeguimientoDto> {
    return this.movimientoService.findOneSeguimiento2(getSeguimiento2MovimientoDto);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    return this.movimientoService.update(+id, updateMovimientoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutMovimientoDto> {
    return this.movimientoService.remove(+id);
  }

  @Post('remove_details/:id')
  removeDetails(@Param('id') id: string): Promise<OutMovimientoDto> {
    return this.movimientoService.removeDetails(+id);
  }
}
