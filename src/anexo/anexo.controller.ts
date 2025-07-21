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
import { AnexoService } from './anexo.service';
import { CreateAnexoDto } from './dto/create-anexo.dto';
import { UpdateAnexoDto } from './dto/update-anexo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Anexo } from '@prisma/client';
import { OutAnexoDto, OutAnexosDto } from './dto/out-anexo.dto';

@Controller('anexo')
@ApiTags('anexo')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class AnexoController {
  constructor(private readonly anexoService: AnexoService) {}

  @Post('create')
  create(
    @Body() createAnexoDto: CreateAnexoDto,
    @Req() request?: Request,
  ): Promise<OutAnexoDto> {
    return this.anexoService.create(createAnexoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutAnexosDto> {
    return this.anexoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutAnexoDto> {
    return this.anexoService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateAnexoDto: UpdateAnexoDto,
    @Req() request?: Request,
  ): Promise<OutAnexoDto> {
    return this.anexoService.update(+id, updateAnexoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutAnexoDto> {
    return this.anexoService.remove(+id);
  }
}
