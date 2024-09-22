import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './use-cases/login.usecase';
import { Response } from 'express';
import JwtGuard from './jwt.guard';
import { Account } from 'src/account/account.entity';

export interface RequestWithUser extends Request {
  user: Omit<Account, 'hashedPassword'>;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyAccountUseCase.execute({ token });
  }

  @Post('login')
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.loginUseCase.execute(input);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  @Get()
  @UseGuards(JwtGuard)
  async me(@Req() request: RequestWithUser) {
    return request.user;
  }
}
