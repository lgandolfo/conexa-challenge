import { Module } from '@nestjs/common';

import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';
import { StarWarModule } from '../startwar/startwar.module';

@Module({
  imports: [StarWarModule],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
