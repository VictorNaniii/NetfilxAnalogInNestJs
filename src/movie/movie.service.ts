import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { CreateMovieDto } from './create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel.name)
    private readonly MovieModel: ModelType<MovieModel>,
  ) {}

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec();

    if (!doc) throw new NotFoundException('Movie not found');

    return doc;
  }

  async getAll(searchTearms?: string) {
    let option = {};

    if (option) {
      option = {
        $or: [{ title: new RegExp(searchTearms, 'i') }],
      };
    }

    return this.MovieModel.find(option)
      .select('updateAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec();
  }
  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.findOne({ actors: actorId }).exec();
    if (!doc) throw new NotFoundException('Movies not found');
    return doc;
  }

  async byGenres(genreIds: string[]) {
    const doc = await this.MovieModel.findOne({
      generes: { $in: genreIds },
    }).exec();
    if (!doc) throw new NotFoundException('Movies not found');
    return doc;
  }

  async updateCountOpen(slug: string) {
    const updateDoc = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      { new: true },
    ).exec();

    if (!updateDoc) throw new NotFoundException('The movie not found');

    return updateDoc;
  }

  async getMostPopular() {
    const doc = await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({
        countOpened: -1,
      })
      .populate('genres')
      .exec();
    return doc;
  }

  // Only for Admin

  async byId(id: Types.ObjectId) {
    const doc = await this.MovieModel.findById(id);
    if (!doc) throw new NotFoundException('Movie not found');
    return doc;
  }

  async create() {
    const defaultValue: CreateMovieDto = {
      actors: [],
      bigposter: '',
      generes: [],
      poster: '',
      slug: '',
      title: '',
      videoUrl: '',
    };
    const movie = await this.MovieModel.create(defaultValue);
    return movie._id;
  }

  async update(id: string, dto: CreateMovieDto) {
    //Telegram notification -!!

    const findService = await this.MovieModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!findService) throw new NotFoundException('Movie not found');

    return findService;
  }

  async delete(id: string) {
    const deleteMovie = await this.MovieModel.findByIdAndDelete(id);

    if (!deleteMovie) throw new NotFoundException('Movie not found');

    return deleteMovie;
  }
}
