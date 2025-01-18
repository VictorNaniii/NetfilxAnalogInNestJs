import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/aut.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipes';
import { Types } from 'mongoose';
import { SetRatingDto } from './dto/set.rating.dto';
import { User } from 'src/user/decorators/user.decorator';

@Controller('ratings')
export class RatingController {
  constructor(private readonly RatingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId,
  ) {
    return this.RatingService.getMovieValueByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(@Body() dto: SetRatingDto, @User('_id') _id: Types.ObjectId) {
    return this.RatingService.SetRating(_id, dto);
  }
}
