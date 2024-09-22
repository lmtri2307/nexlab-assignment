import { MailService } from './mail.service';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { HashService } from './hash.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MailService, HashService, UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
