import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenerModule } from './genere.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class GenereService {
  constructor(
    @InjectModel(GenerModule.name)
    private readonly GenerModule: ModelType<GenerModule>,
  ) {}

  async byId(_id: string) {
    const gener = await this.GenerModule.findById(_id);
    if (!gener) throw new NotFoundException('Genere not found');
    return gener;
  }

  async update(id: string, dto: UpdateGenereDto) {
    
  }
}
