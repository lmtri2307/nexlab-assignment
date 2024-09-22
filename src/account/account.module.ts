import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CreateAccountUseCase } from './use-cases/create-account.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AddressModule } from 'src/address/address.module';
import { UtilsModule } from '@app/utils';
import { FindAccountByIdUseCase } from './use-cases/find-account-by-id.usecase';
import { VerifyAccountUseCase } from './use-cases/verify-account.usecase';
import { FindAccountByEmailUseCase } from './use-cases/find-account-by-email.usecase';
import { FindAccountByPhoneUseCase } from './use-cases/find-account-by-phone.usecase';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Account]), AddressModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    CreateAccountUseCase,
    FindAccountByIdUseCase,
    VerifyAccountUseCase,
    FindAccountByEmailUseCase,
    FindAccountByPhoneUseCase,
  ],
  exports: [AccountService],
})
export class AccountModule {}
