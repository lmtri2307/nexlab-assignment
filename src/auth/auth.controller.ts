import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyAccountUseCase.execute({ token });
  }
}
