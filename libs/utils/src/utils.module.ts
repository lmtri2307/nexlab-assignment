import { MailService } from './mail.service';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { HashService } from './hash.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [MailService, HashService, UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
