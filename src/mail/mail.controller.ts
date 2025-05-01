import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TestMailDto } from './dto/test-mail.dto';

@Controller('mail')
@ApiTags('mail')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // @Post('create')
  // create(@Body() createMailDto: CreateMailDto) {
  //   return this.mailService.create(createMailDto);
  // }

  // @Post('send_form')
  // sendForm(@Body() createMailDto: CreateMailDto) {
  //   return this.mailService.sendForm(createMailDto);
  // }

  // @Post('send_reserva')
  // sendReserva(@Body() createMailDto: CreateMailDto) {
  //   return this.mailService.sendReserva(createMailDto);
  // }

  @Post('send_mail_test')
  sendMailtest(@Body() testMailDto: TestMailDto) {
    return this.mailService.sendMailtest(testMailDto);
  }

  // @Get('find_all')
  // findAll() {
  //   return this.mailService.findAll();
  // }

  // @Get('find_one/:id')
  // findOne(@Param('id') id: string) {
  //   return this.mailService.findOne(+id);
  // }

  // @Patch('update/:id')
  // update(@Param('id') id: string, @Body() updateMailDto: UpdateMailDto) {
  //   return this.mailService.update(+id, updateMailDto);
  // }

  // @Post('remove/:id')
  // remove(@Param('id') id: string) {
  //   return this.mailService.remove(+id);
  // }
}
