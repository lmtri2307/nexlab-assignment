import { UtilsService } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Account } from 'src/account/account.entity';
import { AccountService } from 'src/account/account.service';
import { BaseUseCase } from 'src/base/usecase.base';

export class AccessTokenPayload {
  id: Account['id'];
  role: Account['type'];
}

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  password: string;
}

export class LoginOutput {
  accessToken: string;
}

@Injectable()
export class LoginUseCase extends BaseUseCase<LoginDto, LoginOutput> {
  constructor(
    private readonly accountService: AccountService,
    private readonly utilsService: UtilsService,
  ) {
    super();
  }

  private async loginByEmailOrPhone({
    field,
    value,
    password,
  }: {
    field: 'email' | 'phone';
    value: string;
    password: string;
  }) {
    const account =
      field === 'email'
        ? await this.accountService.findByEmail.execute({ email: value })
        : await this.accountService.findByPhone.execute({
            phone: value,
          });
    if (!account) {
      throw new BadRequestException('Account with this phone not found');
    }

    await this.verifyPassword(password, account.hashedPassword);
    await this.verifyAccount(account);

    return {
      accessToken: await this.generateAccessToken(account),
    };
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatch = await this.utilsService.hashService.comparePassword(
      password,
      hashedPassword,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }
  }

  private async verifyAccount(account: Account) {
    if (!account.isVerified) {
      throw new BadRequestException('Account is not verified');
    }
  }

  private async generateAccessToken(account: Account) {
    const payload: AccessTokenPayload = {
      id: account.id,
      role: account.type,
    };
    return this.utilsService.jwtService.sign(payload);
  }

  async execute({ email, phone, password }: LoginDto) {
    if (email) {
      return this.loginByEmailOrPhone({
        field: 'email',
        value: email,
        password,
      });
    } else if (phone) {
      return this.loginByEmailOrPhone({
        field: 'phone',
        value: phone,
        password,
      });
    } else {
      throw new BadRequestException('Email or Phone is required');
    }
  }
}
