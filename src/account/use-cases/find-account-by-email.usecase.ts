import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseUseCase } from 'src/base/usecase.base';
import { Account } from '../account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class FindAccountByEmailDto {
  email: string;
}

@Injectable()
export class FindAccountByEmailUseCase extends BaseUseCase<
  FindAccountByEmailDto,
  Account
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }
  async execute(req: FindAccountByEmailDto): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { email: req.email },
    });
    if (!account) {
      throw new BadRequestException('Account with this email not found');
    }
    return account;
  }
}
