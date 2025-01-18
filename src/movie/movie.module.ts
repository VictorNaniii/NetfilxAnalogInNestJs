import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

import { MongooseModule } from '@nestjs/mongoose';
import { MovieModel, movieSchema } from './movie.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MovieModel.name,
        schema: movieSchema,
      },
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
