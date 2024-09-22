import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilsModule } from '@app/utils';
import { AccountModule } from 'src/account/account.module';
import { VerifyAccountUseCase } from './use-cases/verify-account.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [ConfigModule, UtilsModule, AccountModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, VerifyAccountUseCase, LoginUseCase, JwtStrategy],
})
export class AuthModule {}
