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
import { FileManagerService } from './file-manager.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { GetMyFilesDto } from './dto/get-my-files.dto';
import { GetFilesAreaDto } from './dto/get-files-area.dto';
import { CreateCarpetaDto } from 'src/carpeta/dto/create-carpeta.dto';
import { UpdateCarpetaDto } from 'src/carpeta/dto/update-carpeta.dto';
import { CreateDocumentoDto } from 'src/documento/dto/create-documento.dto';
import { UpdateDocumentoDto } from 'src/documento/dto/update-documento.dto';
import {
  OutFileManagerDto,
  OutFileManagersDto,
} from './dto/out-file-manager.dto';

@Controller('file_manager')
@ApiTags('file_manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('create_carpeta')
  createCarpeta(
    @Body() createCarpetaDto: CreateCarpetaDto,
    @Req() request?: Request,
  ): Promise<OutFileManagerDto> {
    return this.fileManagerService.createCarpeta(createCarpetaDto, request);
  }

  @Post('create_documento')
  createDocumento(
    @Body() createDocumentoDto: CreateDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutFileManagerDto> {
    return this.fileManagerService.createDocumento(createDocumentoDto, request);
  }

  @Post('find_all_my_files')
  findAllMyFiles(
    @Body() getMyFilesDto: GetMyFilesDto,
  ): Promise<OutFileManagersDto> {
    return this.fileManagerService.findAllMyFiles(getMyFilesDto);
  }

  @Post('find_all_files_area')
  findAllFilesArea(
    @Body() getFilesAreaDto: GetFilesAreaDto,
  ): Promise<OutFileManagersDto> {
    return this.fileManagerService.findAllFilesArea(getFilesAreaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OutFileManagerDto> {
    return this.fileManagerService.findOne(+id);
  }

  @Patch('update_carpeta/:id')
  updateCarpeta(
    @Param('id') id: string,
    @Body() updateCarpetaDto: UpdateCarpetaDto,
    @Req() request?: Request,
  ): Promise<OutFileManagerDto> {
    return this.fileManagerService.updateCarpeta(+id, updateCarpetaDto, request);
  }

  @Patch('update_documento/:id')
  updateDocumento(
    @Param('id') id: string,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
    @Req() request?: Request,
  ): Promise<OutFileManagerDto> {
    return this.fileManagerService.updateDocumento(+id, updateDocumentoDto, request);
  }

  @Post('remove_carpeta/:id')
  removeCarpeta(@Param('id') id: string): Promise<OutFileManagerDto> {
    return this.fileManagerService.removeCarpeta(+id);
  }

  @Post('remove_documento/:id')
  removeDocumento(@Param('id') id: string): Promise<OutFileManagerDto> {
    return this.fileManagerService.removeDocumento(+id);
  }
}
