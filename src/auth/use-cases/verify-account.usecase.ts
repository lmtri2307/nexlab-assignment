import { UtilsService } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/account.entity';
import { BaseUseCase } from 'src/base/usecase.base';
import { Repository } from 'typeorm';

export class VerifyTokenPayload {
  id: string;
}
export class VerifyAccountDto {
  token: string;
}

@Injectable()
export class VerifyAccountUseCase extends BaseUseCase<
  VerifyAccountDto,
  Account
> {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }
  async execute({ token }: VerifyAccountDto) {
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
