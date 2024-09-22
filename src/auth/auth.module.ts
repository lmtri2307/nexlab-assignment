import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilsModule } from '@app/utils';
import { AccountModule } from 'src/account/account.module';
import { VerifyAccountUseCase } from './use-cases/verify-account.usecase';

@Module({
  imports: [UtilsModule, AccountModule],
  controllers: [AuthController],
  providers: [AuthService, VerifyAccountUseCase],
})
export class AuthModule {}
