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
import { RegistroFirmaService } from './registro-firma.service';
import { CreateRegistroFirmaDto } from './dto/create-registro-firma.dto';
import { UpdateRegistroFirmaDto } from './dto/update-registro-firma.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { RegistroFirma } from '@prisma/client';

@Controller('registro_firma')
@ApiTags('registro_firma')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class RegistroFirmaController {
  constructor(private readonly registroFirmaService: RegistroFirmaService) {}

  @Post('create')
  create(
    @Body() createRegistroFirmaDto: CreateRegistroFirmaDto,
    @Req() request: Request,
  ) :Promise<RegistroFirma>{
    return this.registroFirmaService.create(createRegistroFirmaDto, request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto):Promise<RegistroFirma> {
    return this.registroFirmaService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string):Promise<RegistroFirma> {
    return this.registroFirmaService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateRegistroFirmaDto: UpdateRegistroFirmaDto,
    @Req() request: Request,
  ):Promise<RegistroFirma> {
    return this.registroFirmaService.update(
      +id,
      updateRegistroFirmaDto,
      request,
    );
  }

  @Post('remove/:id')
  remove(@Param('id') id: string):Promise<RegistroFirma> {
    return this.registroFirmaService.remove(+id);
  }
}
