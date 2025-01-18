import { SchemaFactory } from '@nestjs/mongoose';
import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/actor.model';
import { GenereModule } from 'src/genere/genere.module';

export interface MovieModel extends Base {}

export class Parameters {
  @prop()
  year: number;

  @prop()
  duration: number;
  @prop()
  contry: string;
}

export class MovieModel extends TimeStamps {
  @prop()
  slug: string;

  @prop()
  poster: string;

  @prop()
  bigposter: string;

  @prop()
  title: string;

  @prop()
  parameters?: Parameters;

  @prop()
  videoUrl: string;

  @prop({ default: 4.0 })
  rating?: number;

  @prop({ default: 0 })
  countOpened?: number;

  @prop({ ref: () => GenereModule })
  generes: Ref<GenereModule>[];

  @prop({ ref: () => ActorModel })
  actors: Ref<ActorModel>[];

  @prop()
  isSendTelegram?: boolean;
}

export const movieSchema = SchemaFactory.createForClass(MovieModel);
