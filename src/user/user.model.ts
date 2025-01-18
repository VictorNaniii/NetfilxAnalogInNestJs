import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { MovieModel } from 'src/movie/movie.model';

export interface UserModel extends Base {}

@Schema()
export class UserModel extends TimeStamps {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: [], ref: () => MovieModel })
  favorites?: Ref<MovieModel>[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
