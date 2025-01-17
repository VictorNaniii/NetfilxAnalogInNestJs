import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorModel, ActorSchema } from './actor.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ActorModel.name,
        schema: ActorSchema,
      },
    ]),
  ],
  providers: [ActorService],
  controllers: [ActorController],
})
export class ActorModule {}
