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
import { OutMovimientoDto, OutMovimientosDto } from './dto/out-movimiento.dto';

@Controller('movimiento')
@ApiTags('movimiento')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @Post('create')
  create(
    @Body() createMovimientoDto: CreateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    return this.movimientoService.create(createMovimientoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutMovimientosDto> {
    return this.movimientoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutMovimientoDto> {
    return this.movimientoService.findOne(+id);
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
}
