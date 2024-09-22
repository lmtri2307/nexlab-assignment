import { UtilsService } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Account } from 'src/account/account.entity';
import { BaseUseCase } from 'src/base/usecase.base';
import { Repository } from 'typeorm';

export class AccessTokenPayload {
  id: Account['id'];
  role: Account['type'];
}

export class LoginInput {
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
export class LoginUseCase extends BaseUseCase<LoginInput, LoginOutput> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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
    const account = await this.accountRepository.findOne({
      where: { [field]: value },
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

  async execute({ email, phone, password }: LoginInput) {
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
