import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MulterExceptionFilter } from './filter/multer-exception.filter';
import { OutFileDto } from './dto/out-file.dto';
import { RemoveFileDto } from './dto/remove-file.dto';
@Controller('file')
@ApiTags('file')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(MulterExceptionFilter)
  create(@UploadedFile() file: Express.Multer.File): Promise<OutFileDto> {
    return this.fileService.create(file);
  }

  @Post('remove')
  removeDocumento(@Body() removeFileDto:RemoveFileDto): Promise<OutFileDto> {
    return this.fileService.remove(removeFileDto);
  }
}
