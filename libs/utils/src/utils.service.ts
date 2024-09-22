import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import { MailService } from './mail.service';

@Injectable()
export class UtilsService {
  constructor(
    public readonly hashService: HashService,
    public readonly mailService: MailService,
  ) {}
}
