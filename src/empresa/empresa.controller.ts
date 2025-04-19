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
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Empresa } from '@prisma/client';
import { OutEmpresaDto, OutEmpresasDto } from './dto/out-empresa.dto';

@Controller('empresa')
@ApiTags('empresa')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post('create')
  create(
    @Body() createEmpresaDto: CreateEmpresaDto,
    @Req() request?: Request,
  ): Promise<OutEmpresaDto> {
    return this.empresaService.create(createEmpresaDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutEmpresasDto> {
    return this.empresaService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutEmpresaDto> {
    return this.empresaService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @Req() request?: Request,
  ): Promise<OutEmpresaDto> {
    return this.empresaService.update(+id, updateEmpresaDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutEmpresaDto> {
    return this.empresaService.remove(+id);
  }
}
