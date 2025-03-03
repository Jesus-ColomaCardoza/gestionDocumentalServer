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
import { CarpetaService } from './carpeta.service';
import { CreateCarpetaDto } from './dto/create-carpeta.dto';
import { UpdateCarpetaDto } from './dto/update-carpeta.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Carpeta } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';

@Controller('carpeta')
@ApiTags('carpeta')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class CarpetaController {
  constructor(private readonly carpetaService: CarpetaService) {}

  @Post('create')
  create(
    @Body() createCarpetaDto: CreateCarpetaDto,
    @Req() request: Request,
  ): Promise<Carpeta> {
    return this.carpetaService.create(createCarpetaDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<Carpeta> {
    return this.carpetaService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<Carpeta> {
    return this.carpetaService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCarpetaDto: UpdateCarpetaDto,
    @Req() request: Request,
  ): Promise<Carpeta> {
    return this.carpetaService.update(+id, updateCarpetaDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<Carpeta> {
    return this.carpetaService.remove(+id);
  }
}
