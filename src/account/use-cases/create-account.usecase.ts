import { BaseUseCase } from 'src/base/usecase.base';
import { Account, AccountType, Gender } from '../account.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/address/address.entity';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UtilsService } from '@app/utils';
import { VerifyTokenPayload } from 'src/auth/use-cases/verify-account.usecase';

class AddressDto {
  @IsString()
  houseNumber: string;

  @IsString()
  street: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  city: string;
}

export class CreateAccountDto {
  @IsString()
  fullName: string;

  @IsString({ message: 'Phone must be a string' })
  @MaxLength(15, { message: 'Phone must be 15 characters' })
  phone: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsDateString(undefined, { message: 'Invalid date of birth' })
  dob: Date;

  @IsString()
  avatarUrl: string;

  @IsEnum(Gender, { message: 'Invalid Gender' })
  gender: Gender;

  @IsOptional()
  address?: AddressDto;

  @IsEnum(AccountType, { message: 'Invalid Account Type' })
  type: AccountType;
}

@Injectable()
export class CreateAccountUseCase extends BaseUseCase<
  CreateAccountDto,
  Omit<Account, 'hashedPassword'>
> {
  constructor(
    @InjectRepository(Account)
    private readonly notificationRepository: Repository<Account>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly utilsService: UtilsService,
  ) {
    super();
  }

  private async sendVerificationEmail(account: Account) {
    const payload: VerifyTokenPayload = { id: account.id };
    const token = this.utilsService.jwtService.sign(payload);
    const url = `http://localhost:3000/auth/verify?token=${token}`;
    this.utilsService.mailService.sendMail({
      to: account.email,
      subject: 'Welcome to our platform',
      body: `Click ${url} to verify your account`,
    });
  }

  async execute({
    fullName,
    phone,
    password,
    email,
    dob,
    avatarUrl,
    gender,
    type,
    address,
  }: CreateAccountDto) {
    if (type === AccountType.FREELANCER && !address) {
      throw new BadRequestException('Freelancer must have address');
    }

    await this.verifyPhone(phone);
    await this.verifyEmail(email);

    const account = new Account();
    account.fullName = fullName;
    account.phone = phone;
    account.hashedPassword =
      await this.utilsService.hashService.hashPassword(password);
    account.email = email;
    account.dob = dob;
    account.avatarUrl = avatarUrl;
    if (address) {
      const newAddress = new Address();
      newAddress.houseNumber = address.houseNumber;
      newAddress.street = address.street;
      newAddress.ward = address.ward;
      newAddress.district = address.district;
      newAddress.city = address.city;
      account.address = await this.addressRepository.save(newAddress);
    } else {
      account.address = null;
    }
    account.gender = gender;
    account.type = type;

    const savedAccount = await this.notificationRepository.save(account);
    await this.sendVerificationEmail(savedAccount);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...accountData } = savedAccount;
    return accountData;
  }

  private async verifyPhone(phone: string) {
    const accountExist = await this.notificationRepository.findOne({
      where: [{ phone }],
    });
    if (accountExist) {
      throw new BadRequestException(
        'Account with this phone number already exist',
      );
    }
  }

  private async verifyEmail(email: string) {
    const accountExist = await this.notificationRepository.findOne({
      where: [{ email }],
    });
    if (accountExist) {
      throw new BadRequestException('Account with this email already exist');
    }
  }
}
