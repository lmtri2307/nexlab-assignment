import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface MailData {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class MailService {
  private nodemailerTransport: Mail;
  constructor(readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('MAIL_SERVICE'),
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    });
  }
  async sendMail(mail: MailData) {
    return this.nodemailerTransport.sendMail({
      to: mail.to,
      subject: mail.subject,
      text: mail.body,
    });
  }
}
