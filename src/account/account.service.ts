import { Injectable } from '@nestjs/common';
import { CreateAccountUseCase } from './use-cases/create-account.usecase';

@Injectable()
export class AccountService {
  constructor(public createAccount: CreateAccountUseCase) {}
}
