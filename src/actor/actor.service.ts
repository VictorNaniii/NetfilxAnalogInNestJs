import { Injectable } from '@nestjs/common';
import { ActorModel } from './actor.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel.name)
    private readonly ActorModel: ModelType<ActorModel>, ASDFG5H6K//.,MNUBVTCEXW\
  ) {}


}
