import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdatedUserDto } from './dto/updated.user.dto';
import { genSalt, getSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';
import { path } from 'app-root-path';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly UserModel: ModelType<UserModel>,
  ) {}

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id);
    if (!user) throw new NotFoundException('This user not found');

    return user;
  }

  async updatedProfile(_id: string, dto: UpdatedUserDto) {
    const user = await this.byId(_id);

    if (dto.email) {
      const isSameUser = await this.UserModel.findOne({ email: dto.email });
      if (isSameUser && String(_id) !== String(isSameUser._id)) {
        throw new NotFoundException('Email busy');
      }
    }

    if (dto.email) {
      user.email = dto.email;
    }

    if (dto.password) {
      const salt = await genSalt(3);
      user.password = await hash(dto.password, salt);
    }

    if (dto.isAdmin !== undefined) {
      user.isAdmin = dto.isAdmin;
    }

    await user.save();

    return user;
  }

  async getCount() {
    const userCount = await this.UserModel.countDocuments().exec();
    return userCount;
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [{ email: new RegExp(searchTerm, 'i') }],
      };
    }
    return this.UserModel.find(options)
      .select('-password -uppdatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec();
  }

  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec();
  }

  async toggleFavorites(movieId: Types.ObjectId, user: UserModel) {
    const { _id, favorites } = user;
    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
        ? favorites.filter((id) => String(id) !== String(movieId))
        : [...favorites, movieId],
    });
  }

  async getFavorites(_id: Types.ObjectId) {
    const user = await this.UserModel.findById(_id, 'favorites').populate({
      path: 'favorites',
      populate: {
        path: 'genres',
      },
    });

    return user ? user.favorites : null;
  }
}

