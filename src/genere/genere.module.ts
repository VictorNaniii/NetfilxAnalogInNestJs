import { Module } from '@nestjs/common';
import { GenereController } from './genere.controller';
import { GenereService } from './genere.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/user/user.model';
import { GenerModule } from './genere.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GenerModule.name,
        schema: 'Genere',
      },
    ]),
  ],
  controllers: [GenereController],
  providers: [GenereService],
})
export class GenereModule {}
