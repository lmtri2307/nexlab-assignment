import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './use-cases/login.usecase';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyAccountUseCase.execute({ token });
  }

  @Post('login')
  async login(
    @Body() input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.loginUseCase.execute(input);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }
}
