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

class AddressInput {
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

export class CreateAccountInput {
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
  address?: AddressInput;

  @IsEnum(AccountType, { message: 'Invalid Account Type' })
  type: AccountType;
}

@Injectable()
export class CreateAccountUseCase extends BaseUseCase<
  CreateAccountInput,
  Account
> {
  constructor(
    @InjectRepository(Account)
    private readonly notificationRepository: Repository<Account>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super();
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
  }: CreateAccountInput) {
    if (type === AccountType.FREELANCER && !address) {
      throw new BadRequestException('Freelancer must have address');
    }

    const accountExist = await this.notificationRepository.findOne({
      where: [{ phone }],
    });
    if (accountExist) {
      throw new BadRequestException(
        'Account with this phone number already exist',
      );
    }

    const account = new Account();
    account.fullName = fullName;
    account.phone = phone;
    account.hashedPassword = password;
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

    return await this.notificationRepository.save(account);
  }
}
