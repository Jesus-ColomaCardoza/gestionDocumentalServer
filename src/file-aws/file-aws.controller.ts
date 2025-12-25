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
import { OutFileAwsDto, OutFilesAwsDto, OutFilesManagerAwsDto } from './dto/out-file-aws.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetFileManagerAwsDto } from './dto/get-file-manager-aws.dto';

@Controller('file_aws')
@ApiTags('file_aws')
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
  ): Promise<OutFilesAwsDto> {
    return this.fileAwsService.findAll(combinationsFiltersDto);
  }

  @Post('find_all_by_area')
  findAllByArea(
    @Body() getFileManagerAwsDto: GetFileManagerAwsDto,
  ): Promise<OutFilesManagerAwsDto> {
    return this.fileAwsService.findAllByArea(getFileManagerAwsDto);
  }

  @Get('find_one/:id')
  findOne(@Param('id') id: string): Promise<OutFileAwsDto> {
    return this.fileAwsService.findOne(+id);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateFileAwsDto: UpdateFileAwsDto,
    @Req() request?: Request,
  ): Promise<OutFileAwsDto> {
    return this.fileAwsService.update(+id, file, updateFileAwsDto, request);
  }

  @Post('remove/:id')
  remove(@Param('id') id: string): Promise<OutFileAwsDto> {
    return this.fileAwsService.remove(+id);
  }
}
