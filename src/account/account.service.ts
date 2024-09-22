import { Injectable } from '@nestjs/common';
import { CreateAccountUseCase } from './use-cases/create-account.usecase';
import { FindAccountByIdUseCase } from './use-cases/find-account-by-id.usecase';
import { VerifyAccountUseCase } from './use-cases/verify-account.usecase';
import { FindAccountByEmailUseCase } from './use-cases/find-account-by-email.usecase';
import { FindAccountByPhoneUseCase } from './use-cases/find-account-by-phone.usecase';

@Injectable()
export class AccountService {
  constructor(
    public createAccount: CreateAccountUseCase,
    public findAccountById: FindAccountByIdUseCase,
    public verifyAccount: VerifyAccountUseCase,
    public findByEmail: FindAccountByEmailUseCase,
    public findByPhone: FindAccountByPhoneUseCase,
  ) {}
}
