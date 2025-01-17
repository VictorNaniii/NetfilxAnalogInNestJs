import { Injectable, NotFoundException } from '@nestjs/common';
import { ActorModel } from './actor.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundError, retry } from 'rxjs';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel.name)
    private readonly ActorModel: ModelType<ActorModel>,
  ) {}

  async bySlug(slug: string) {
    return this.ActorModel.findOne({ slug }).exec();
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }
    // Ned wil add agregation aftert creating movie model -!!

    return this.ActorModel.find(options)
      .select('-updateAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }
  async byId(id: string) {
    const actor = await this.ActorModel.findById(id);
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };

    const actor = await this.ActorModel.create(defaultValue);
    return actor._id;
  }

  async update(id: string, dto: ActorDto) {
    const updateDto = await this.ActorModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updateDto) throw new NotFoundException('Autor not found');

    return updateDto;
  }

  async delete(id: string) {
    const deleteActor = await this.ActorModel.findByIdAndDelete(id).exec;

    if (!deleteActor) throw new NotFoundException('Author not found');
    return deleteActor;
  }
  ///--=
}