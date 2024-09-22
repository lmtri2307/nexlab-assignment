import { Body, Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountInput } from './use-cases/create-account.usecase';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/register')
  async register(@Body() body: CreateAccountInput) {
    return this.accountService.createAccount.execute(body);
  }
}
