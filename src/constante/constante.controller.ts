import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConstanteService } from './constante.service';
import { CreateConstanteDto } from './dto/create-constante.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';
import { Constante } from '@prisma/client';
import { OutConstanteDto, OutConstantesDto } from './dto/out-constante.dto';
import { UpdateConstanteDto } from './dto/update-cargo.dto';

@Controller('constante')
@ApiTags('constante')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class ConstanteController {
  constructor(private readonly constanteService: ConstanteService) {}

  @Post('create')
  create(
    @Body() createConstanteDto: CreateConstanteDto,
    @Req() request?: Request,
  ): Promise<OutConstanteDto> {
    return this.constanteService.create(createConstanteDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutConstantesDto> {
    return this.constanteService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutConstanteDto> {
    return this.constanteService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateConstanteDto: UpdateConstanteDto,
    @Req() request?: Request,
  ): Promise<OutConstanteDto> {
    return this.constanteService.update(+id, updateConstanteDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutConstanteDto> {
    return this.constanteService.remove(+id);
  }
}
