import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileAwsService } from './file-aws.service';
import { CreateFileAwsDto } from './dto/create-file-aws.dto';
import { UpdateFileAwsDto } from './dto/update-file-aws.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { OutFileAwsDto, OutFileAwssDto } from './dto/out-file-aws.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-aws')
@ApiTags('file-aws')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class FileAwsController {
  constructor(private readonly fileAwsService: FileAwsService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileAwsDto: CreateFileAwsDto,
    @Req() request?: Request,
  ): Promise<OutFileAwsDto> {    
    return this.fileAwsService.create(
      file,
      createFileAwsDto, 
      request);
  }

  @Post('find_all')
  findAll(
    @Body() combinationsFiltersDto: CombinationsFiltersDto,
  ): Promise<OutFileAwssDto> {
    return this.fileAwsService.findAll(combinationsFiltersDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutFileAwsDto> {
    return this.fileAwsService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateFileAwsDto: UpdateFileAwsDto,
    @Req() request?: Request,
  ): Promise<OutFileAwsDto> {
    return this.fileAwsService.update(+id, updateFileAwsDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutFileAwsDto> {
    return this.fileAwsService.remove(+id);
  }
}
