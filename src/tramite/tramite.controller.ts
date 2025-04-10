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
import { OutTramiteDto, OutTramitesDto } from './dto/out-tramite.dto';
@Controller('tramite')
@ApiTags('tramite')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService) {}

  @Post('create')
  create(
    @Body() createTramiteDto: CreateTramiteDto,
    @Req() request?: Request,
  ): Promise<OutTramiteDto> {
    return this.tramiteService.create(createTramiteDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutTramitesDto> {
    return this.tramiteService.findAll(combinationsFiltersDto);
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
