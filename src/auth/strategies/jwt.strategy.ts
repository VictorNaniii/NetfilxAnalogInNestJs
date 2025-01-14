import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly ConfigService: ConfigService,
    @InjectModel(UserModel.name)
    private readonly UserModel: ModelType<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: ConfigService.get('JWT_SECRET'),
    });
    // console.log('JWT Secret:', ConfigService.get('JWT_SECRET'));
  }

  async validate({ _id }: Pick<UserModel, '_id'>) {
    console.log('Payload ID:', _id); // Verifică payload-ul
    const user = await this.UserModel.findById(_id).exec();
    console.log('Found User:', user); // Verifică utilizatorul
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
