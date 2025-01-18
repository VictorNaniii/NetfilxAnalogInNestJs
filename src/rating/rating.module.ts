import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema } from './rating.model';
import { MovieModel } from 'src/movie/movie.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RatingModule.name,
        schema: RatingSchema,
      },
    ]),
    MovieModel,
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
