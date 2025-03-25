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
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Documento } from '@prisma/client';
import { OutDocumentoDto, OutDocumentosDto } from './dto/out-documento.dto';

@Controller('documento')
@ApiTags('documento')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post('create')
  create(
    @Body() createDocumentoDto: CreateDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutDocumentoDto> {
    return this.documentoService.create(createDocumentoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutDocumentosDto> {
    return this.documentoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutDocumentoDto> {
    return this.documentoService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutDocumentoDto> {
    return this.documentoService.update(+id, updateDocumentoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutDocumentoDto> {
    return this.documentoService.remove(+id);
  }
}
