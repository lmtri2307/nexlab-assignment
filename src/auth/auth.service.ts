import { Injectable } from '@nestjs/common';
import { VerifyAccountUseCase } from './use-cases/verify-account.usecase';
import { LoginUseCase } from './use-cases/login.usecase';

@Injectable()
export class AuthService {
  constructor(
    public readonly verifyAccountUseCase: VerifyAccountUseCase,
    public readonly loginUseCase: LoginUseCase,
  ) {}
}
