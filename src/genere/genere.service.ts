import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenerModule } from './genere.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateGenereDto } from './dto/create.dto.gener';
import { genSalt } from 'bcryptjs';
import { throwError } from 'rxjs';
import { MovieService } from './../movie/movie.service';
import { Icolection } from './genere.interface.dto';

@Injectable()
export class GenereService {
  constructor(
    @InjectModel(GenerModule.name)
    private readonly GenerModule: ModelType<GenerModule>,
    private readonly MovieService: MovieService,
  ) {}

  async getAllGenere(searchTerm?: string) {
    let option = {};

    if (searchTerm)
      option = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };

    return this.GenerModule.find(option)
      .select('-updatedAt -__v')
      .sort({ createAt: 'desc' })
      .exec();
  }

  async bySlug(slug: string) {
    const genereSlug = await this.GenerModule.findOne({ slug }).exec();
    if (!genereSlug) throw new NotFoundException('Genere not found');
    return genereSlug;
  }

  async getColections() {
    const geners = await this.getAllGenere();
    const collections = await Promise.all(
      geners.map(async (genre) => {
        const moviesByGenre = await this.MovieService.byGenres([genre._id]);

        const result: Icolection = {
          _id: String(genre._id),
          image: moviesByGenre[0].bigposter,
          slug: genre.slug,
          title: genre.name,
        };

        return result;
      }),
    );
    return collections;
  }

  // --Admin Place
  async update(id: string, dto: CreateGenereDto) {
    const updateGenere = await this.GenerModule.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();

    if (!updateGenere) throw new NotFoundException('Genere is not found');
    return updateGenere;
  }

  async delete(id: string) {
    const deleteGenere = await this.GenerModule.findByIdAndDelete(id).exec();
    if (!deleteGenere) throw new NotFoundException('Genere not found');
    return deleteGenere;
  }

  async byId(_id: string) {
    const gener = await this.GenerModule.findById(_id);
    if (!gener) throw new NotFoundException('Genere not found');
    return gener;
  }

  async create() {
    const defaultValue: CreateGenereDto = {
      descripton: '',
      icon: '',
      name: '',
      slug: '',
    };
    const genere = await this.GenerModule.create(defaultValue);
    return genere._id;
  }
}
