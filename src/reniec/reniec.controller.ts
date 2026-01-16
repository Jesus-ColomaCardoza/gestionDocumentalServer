import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { ReniecService } from './reniec.service';
import {  BuscarRucDto } from './dto/buscar-ruc.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BuscarDniDto } from './dto/buscar-dni.dto';

@Controller('reniec')
@ApiTags('reniec')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class ReniecController {
  constructor(private readonly reniecService: ReniecService) {}

  @Post('buscar_dni')
  buscarDni(
    @Body() buscarDniDto: BuscarDniDto,
  ): Promise<any> {
    return this.reniecService.buscarDni(buscarDniDto);
  }

  @Post('buscar_ruc')
  buscarRuc(
    @Body() buscarRucDto: BuscarRucDto,
  ): Promise<any> {
    return this.reniecService.buscarRuc(buscarRucDto);
  }
}
