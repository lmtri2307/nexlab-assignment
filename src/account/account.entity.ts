import { Address } from 'src/address/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AccountType {
  OWNER = 'OWNER',
  FREELANCER = 'FREELANCER',
}

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  hashedPassword: string;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('text')
  fullName: string;

  @Column('varchar', { length: 15, unique: true })
  phone: string;

  @Column('text')
  email: string;

  @Column('date')
  dob: Date;

  @Column('text')
  avatarUrl: string;

  @Column('enum', { enum: Gender })
  gender: Gender;

  @OneToOne(() => Address, (address) => address.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  address: Address | null;

  @Column('enum', { enum: AccountType })
  type: AccountType;
}
