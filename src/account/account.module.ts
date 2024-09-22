import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CreateAccountUseCase } from './use-cases/create-account.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AddressModule } from 'src/address/address.module';
import { UtilsModule } from '@app/utils';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Account]), AddressModule],
  controllers: [AccountController],
  providers: [AccountService, CreateAccountUseCase],
})
export class AccountModule {}
