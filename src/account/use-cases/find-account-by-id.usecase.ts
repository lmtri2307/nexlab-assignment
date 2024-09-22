import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '../account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUseCase } from 'src/base/usecase.base';

export class FindAccountByIdDto {
  id: Account['id'];
}

@Injectable()
export class FindAccountByIdUseCase extends BaseUseCase<
  FindAccountByIdDto,
  Account
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }

  async execute({ id }: FindAccountByIdDto) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    return account;
  }
}
