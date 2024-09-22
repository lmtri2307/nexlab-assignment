import { UtilsService } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from 'src/account/account.entity';
import { AccountService } from 'src/account/account.service';
import { BaseUseCase } from 'src/base/usecase.base';

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
    private readonly accountService: AccountService,
  ) {
    super();
  }
  async execute({ token }: VerifyAccountDto) {
    const { id } =
      this.utilsService.jwtService.verify<VerifyTokenPayload>(token);
    const account = await this.accountService.findAccountById.execute({ id });
    if (!account) {
      throw new BadRequestException('Invalid token');
    }
    account.isVerified = true;
    return await this.accountService.verifyAccount.execute({ account });
  }
}
