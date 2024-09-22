import { Injectable } from '@nestjs/common';
import { VerifyAccountUseCase } from './use-cases/verify-account.usecase';

@Injectable()
export class AuthService {
  constructor(public readonly verifyAccountUseCase: VerifyAccountUseCase) {}
}
