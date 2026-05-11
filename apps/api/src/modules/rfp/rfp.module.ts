import { Module } from '@nestjs/common';

import { RfpController } from './rfp.controller';
import { RfpService } from './rfp.service';

@Module({
  controllers: [RfpController],
  providers: [RfpService],
  exports: [RfpService],
})
export class RfpModule {}
