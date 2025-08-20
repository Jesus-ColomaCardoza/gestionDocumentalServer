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
import { ArchivadorService } from './archivador.service';
import { CreateArchivadorDto } from './dto/create-archivador.dto';
import { UpdateArchivadorDto } from './dto/update-archivador.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';
import { OutArchivadorDto, OutArchivadoresDto,} from './dto/out-archivador.dto';

@Controller('archivador')
@ApiTags('archivador')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class ArchivadorController {
  constructor(private readonly archivadorService: ArchivadorService) {}

  @Post('create')
  create(
    @Body() createArchivadorDto: CreateArchivadorDto,
    @Req() request?: Request,
  ): Promise<OutArchivadorDto> {
    return this.archivadorService.create(createArchivadorDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutArchivadoresDto> {
    return this.archivadorService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutArchivadorDto> {
    return this.archivadorService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateArchivadorDto: UpdateArchivadorDto,
    @Req() request?: Request,
  ): Promise<OutArchivadorDto> {
    return this.archivadorService.update(+id, updateArchivadorDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutArchivadorDto> {
    return this.archivadorService.remove(+id);
  }
}
