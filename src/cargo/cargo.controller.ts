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
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { Request } from 'express';
import { Cargo } from '@prisma/client';
import { OutCargoDto, OutCargosDto } from './dto/out-cargo.dto';

@Controller('cargo')
@ApiTags('cargo')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Post('create')
  create(
    @Body() createCargoDto: CreateCargoDto,
    @Req() request?: Request,
  ): Promise<OutCargoDto> {
    return this.cargoService.create(createCargoDto, request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutCargosDto> {
    return this.cargoService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutCargoDto> {
    return this.cargoService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCargoDto: UpdateCargoDto,
    @Req() request?: Request,
  ): Promise<OutCargoDto> {
    return this.cargoService.update(+id, updateCargoDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutCargoDto> {
    return this.cargoService.remove(+id);
  }
}
