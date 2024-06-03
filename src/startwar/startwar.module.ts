import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { StarWarService } from './services/starwar.service';

@Module({
  imports: [HttpModule],
  providers: [StarWarService],
  exports: [StarWarService],
})
export class StarWarModule {}
