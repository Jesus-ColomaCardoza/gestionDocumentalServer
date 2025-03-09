import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { Area } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { OutAreaDto, OutAreasDto } from './dto/out-area.dto';

@Controller('area')
@ApiTags('area')
// @UseGuards(AuthGuard)
// @ApiBearerAuth() 
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post('create')
  create(@Body() createAreaDto: CreateAreaDto,
  @Req() request?: Request,
) :Promise<OutAreaDto>{
    return this.areaService.create(createAreaDto,request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto): Promise<OutAreasDto> {
    return this.areaService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string) :Promise<OutAreaDto>{
    return this.areaService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto,
  @Req() request?: Request,
):Promise<OutAreaDto> {
    return this.areaService.update(+id, updateAreaDto,request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string):Promise<OutAreaDto> {
    return this.areaService.remove(+id);
  }
}
