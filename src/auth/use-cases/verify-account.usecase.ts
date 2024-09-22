import { UtilsService } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/account.entity';
import { BaseUseCase } from 'src/base/usecase.base';
import { Repository } from 'typeorm';

export class VerifyTokenPayload {
  id: string;
}
export class VerifyAccountInput {
  token: string;
}

@Injectable()
export class VerifyAccountUseCase extends BaseUseCase<
  VerifyAccountInput,
  Account
> {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }
  async execute({ token }: VerifyAccountInput) {
    const { id } =
      this.utilsService.jwtService.verify<VerifyTokenPayload>(token);
    const account = await this.accountRepository.findOne({
      where: { id },
    });
    if (!account) {
      throw new BadRequestException('Invalid token');
    }
    account.isVerified = true;
    return await this.accountRepository.save(account);
  }
}
