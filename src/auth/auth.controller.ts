import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignupAuthDto, SignupGoogleAuthDto } from './dto/signup-auth.dto';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { VerifyTokenAuthDto } from './dto/verify-token-auth.dto';
import { TokenAuthDto } from './dto/token-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('login_google')
  loginGoogle(@Body() tokenAuthDto: TokenAuthDto) {
    return this.authService.loginGoogle(tokenAuthDto);
  }

  @Post('signup')
  signup(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signup(signupAuthDto);
  }

  @Post('signup_google')
  signupGoogle(@Body() signupGoogleAuthDto: SignupGoogleAuthDto) {
    return this.authService.signupGoogle(signupGoogleAuthDto);
  }

  @Post('forgot_password')
  forgotPassword(@Body() forgotPasswordAuthDto: ForgotPasswordAuthDto) {
    return this.authService.forgotPassword(forgotPasswordAuthDto);
  }

  @Post('reset_password')
  resetPassword(@Body() resetPasswordAuthDto: ResetPasswordAuthDto) {
    return this.authService.resetPassword(resetPasswordAuthDto);
  }

  @Post('verify_token')
  verifyToken(@Body() verifyTokenAuthDto: VerifyTokenAuthDto) {
    return this.authService.verifyToken(verifyTokenAuthDto);
  }
}
