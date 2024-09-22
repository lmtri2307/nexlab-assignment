import { BaseUseCase } from 'src/base/usecase.base';
import { Injectable } from '@nestjs/common';
import { Account } from '../account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class VerifyAccountDto {
  account: Account;
}

@Injectable()
export class VerifyAccountUseCase extends BaseUseCase<
  VerifyAccountDto,
  Account
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }

  async execute({ account }: VerifyAccountDto) {
    account.isVerified = true;
    return await this.accountRepository.save(account);
  }
}
