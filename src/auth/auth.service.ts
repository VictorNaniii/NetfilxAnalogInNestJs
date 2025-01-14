import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash, getSalt, compare, genSalt } from 'bcryptjs';

import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefresDto } from './dto/refresh.token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly UserModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({
      email: dto.email,
    });

    if (oldUser)
      throw new BadRequestException('User with that email alredy exist');

    const salt = await genSalt(3);
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });

    const tokens = await this.issueTokenPair(String(newUser._id));

    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    };
  }

  async getNewTokens(dto: RefresDto) {
    const refreshToken = dto.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('Pleasse sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expierd! ');

    const user = await this.UserModel.findById(result._id);

    const tokens = await this.issueTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({
      email: dto.email,
    });
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordValid = await compare(dto.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Incorect password');
    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }
  async returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
