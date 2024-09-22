import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  houseNumber: string;

  @Column('text')
  street: string;

  @Column('text')
  ward: string;

  @Column('text')
  district: string;

  @Column('text')
  city: string;
}
