import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenerModule } from './genere.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateGenereDto } from './dto/create.dto.gener';
import { genSalt } from 'bcryptjs';

@Injectable()
export class GenereService {
  constructor(
    @InjectModel(GenerModule.name)
    private readonly GenerModule: ModelType<GenerModule>,
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
    return this.GenerModule.findOne({ slug }).exec();
  }

  async getColections() {
    const geners = await this.getAllGenere();
    const collections = geners;
    // NED WIL WRITE -!!
    return collections;
  }

  // --Admin Place
  async update(id: string, dto: CreateGenereDto) {
    return this.GenerModule.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
  }

  async delete(id: string) {
    return this.GenerModule.findByIdAndDelete(id).exec();
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
