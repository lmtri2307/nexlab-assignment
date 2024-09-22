import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseUseCase } from 'src/base/usecase.base';
import { Account } from '../account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class FindAccountByPhoneDto {
  phone: string;
}

@Injectable()
export class FindAccountByPhoneUseCase extends BaseUseCase<
  FindAccountByPhoneDto,
  Account
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }
  async execute(req: FindAccountByPhoneDto): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { phone: req.phone },
    });
    if (!account) {
      throw new BadRequestException('Account with this phone not found');
    }
    return account;
  }
}
