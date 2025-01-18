import { IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class SetRatingDto {
  movieId: Types.ObjectId;

  @IsNumber()
  value: number;
}
