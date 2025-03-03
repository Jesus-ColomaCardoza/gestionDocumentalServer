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
import { CompartidoService } from './compartido.service';
import { CreateCompartidoDto } from './dto/create-compartido.dto';
import { UpdateCompartidoDto } from './dto/update-compartido.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Compartido } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';

@Controller('compartido')
@ApiTags('compartido')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class CompartidoController {
  constructor(private readonly compartidoService: CompartidoService) {}

  @Post('create')
  create(
    @Body() createCompartidoDto: CreateCompartidoDto,
    @Req() request: Request,
  ): Promise<Compartido> {
    return this.compartidoService.create(createCompartidoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<Compartido> {
    return this.compartidoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<Compartido> {
    return this.compartidoService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCompartidoDto: UpdateCompartidoDto,
    @Req() request: Request,
  ): Promise<Compartido> {
    return this.compartidoService.update(+id, updateCompartidoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<Compartido> {
    return this.compartidoService.remove(+id);
  }
}
