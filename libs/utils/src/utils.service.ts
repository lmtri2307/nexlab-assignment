import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import { MailService } from './mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilsService {
  constructor(
    public readonly hashService: HashService,
    public readonly mailService: MailService,
    public readonly jwtService: JwtService,
  ) {}
}
