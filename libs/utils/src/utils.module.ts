import { Module } from '@nestjs/common';
import { HashService, UtilsService } from './utils.service';

@Module({
  providers: [HashService, UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
