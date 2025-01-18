import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Type,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { IdValidationPipe } from 'src/pipes/id.validation.pipes';
import { Types } from 'mongoose';
import { HttpAdapterHost } from '@nestjs/core';
import { Auth } from 'src/auth/decorators/aut.decorator';
import { CreateMovieDto } from './create-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async byActorId(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId);
  }
  @UsePipes(new ValidationPipe())
  @Post('by-genres')
  @HttpCode(200)
  async byGenresId(@Body('genreIds') genreIds: string[]) {
    return this.movieService.byGenres(genreIds);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Put('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpen(slug);
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: Types.ObjectId) {
    return this.movieService.byId(id);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  @Put(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateMovieDto,
  ) {
    return this.movieService.update(id, dto);
  }
  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.delete(id);
  }
}
