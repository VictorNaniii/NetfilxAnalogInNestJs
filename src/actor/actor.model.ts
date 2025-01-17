import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface ActorModel extends Base {}
export class ActorModel extends TimeStamps {
  @Prop({ unique: true })
  slug: string;

  @Prop()
  name: string;

  @Prop()
  phot: string;
}

export const ActorSchema = SchemaFactory.createForClass(ActorModel);
