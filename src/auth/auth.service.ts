import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserModel } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly UserModel: Model<UserModel>,
  ) {}

  async register(dto: any) {
    const newUser = new this.UserModel(dto);
    return newUser.save();
  }
}
