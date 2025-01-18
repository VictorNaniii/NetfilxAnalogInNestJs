import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RatingModel } from './rating.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MovieService } from './../movie/movie.service';
import { Types } from 'mongoose';
import { SetRatingDto } from './dto/set.rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel.name)
    private readonly RatingModel: ModelType<RatingModel>,
    private readonly MovieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.RatingModel.findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }

  async averageRatingByMovieId(movieId: Types.ObjectId | string) {
    const ratingMovie: RatingModel[] = await this.RatingModel.aggregate()
      .match({
        movieId: new Types.ObjectId(movieId),
      })
      .exec();

    return (
      ratingMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingMovie.length
    );
  }

  async SetRating(userId: Types.ObjectId, dto: SetRatingDto) {
    const { movieId, value } = dto;
    const newRating = await this.RatingModel.findOneAndUpdate(
      { movieId, userId },
      {
        movieId,
        userId,
        value,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    const averageRating = await this.averageRatingByMovieId(movieId);
    await this.MovieService.updateRating(movieId, averageRating);
    return newRating;
  }
}
