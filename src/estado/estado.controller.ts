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
import { EstadoService } from './estado.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Estado } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { OutEstadoDto, OutEstadosDto } from './dto/out-estado.dto';

@Controller('estado')
@ApiTags('estado')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Post('create')
  create(@Body() createEstadoDto: CreateEstadoDto,
  @Req() request?: Request,
): Promise<OutEstadoDto> {
    return this.estadoService.create(createEstadoDto,request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutEstadosDto> {
    return this.estadoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutEstadoDto> {
    return this.estadoService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateEstadoDto: UpdateEstadoDto,
    @Req() request?: Request,
  ): Promise<OutEstadoDto> {
    return this.estadoService.update(+id, updateEstadoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutEstadoDto> {
    return this.estadoService.remove(+id);
  }
}
