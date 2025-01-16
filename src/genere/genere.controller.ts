import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GenereService } from './genere.service';
import { Auth } from 'src/auth/decorators/aut.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipes';
import { CreateGenereDto } from './dto/create.dto.gener';

@Controller('generes')
export class GenereController {
  constructor(private readonly genereService: GenereService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genereService.bySlug(slug);
  }

  @Get('collections')
  async getCollection() {
    return this.genereService.getColections();
  }
  @Get()
  async getAll(@Query('searchTearms') searchTearms?: string) {
    return this.genereService.getAllGenere(searchTearms);
  }
  @Get('id')
  @Auth('admin')
  async getGeners(@Param('id', IdValidationPipe) id: string) {
    return this.genereService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateGeners(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenereDto,
  ) {
    return this.genereService.update(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.genereService.create();
  }
}
