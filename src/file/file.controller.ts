import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@Controller('file')
@ApiTags('file')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class FileController {
  constructor(
    private readonly fileService: FileService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.create(file);
  }
}
