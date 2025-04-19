import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { Rol } from '@prisma/client';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { OutRolDto, OutRolesDto } from './dto/out-rol.dto';

@Controller('rol')
@ApiTags('rol')
// @UseGuards(AuthGuard)
// @ApiBearerAuth() 
export class RolController {
  constructor(private readonly rolService: RolService) { }

  @Post('create')
  create(@Body() createRolDto: CreateRolDto,
    @Req() request?: Request,
  ): Promise<OutRolDto> {
    return this.rolService.create(createRolDto, request);
  }

  @Post('find_all')
  findAll(@Body() combinationsFiltersDto: CombinationsFiltersDto): Promise<OutRolesDto> {
    return this.rolService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutRolDto> {
    return this.rolService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto,
    @Req() request?: Request,): Promise<OutRolDto> {
    return this.rolService.update(id, updateRolDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutRolDto> {
    return this.rolService.remove(id);
  }
}
