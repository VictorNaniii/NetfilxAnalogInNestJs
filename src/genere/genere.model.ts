import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
export interface GenerModule extends Base {}
export class GenerModule extends TimeStamps {
  @prop()
  name: string;

  @prop({ unique: true })
  slug: string;

  @prop()
  descripton: string;

  @prop()
  icon: string;
}
