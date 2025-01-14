import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/aut.decorator';
import { User } from './decorators/user.decorator';
import { UpdatedUserDto } from './dto/updated.user.dto';
import { response } from 'express';
import { json } from 'stream/consumers';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.UserService.byId(_id);
  }

  // @UsePipes(new ValidationPipe())
  // @Put('profile')
  // @HttpCode(200)
  // @Auth()
  // async updateProfile(@User('id') id: string, @Body() dto: UpdatedUserDto) {
  //   return this.UserService.updatedProfile(id, dto);
  // }
  @Get('test')
  @HttpCode(200)
  async getTest() {
    console.log('test');
    return 'test';
  }

  @Get('count')
  @HttpCode(200)
  @Auth('admin')
  async getCount() {
    return this.UserService.getCount();
  }

  @Get()
  @HttpCode(200)
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.UserService.getAll(searchTerm);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', ValidationPipe) id: string,
    @Body() dto: UpdatedUserDto,
  ) {
    console.log(dto);
    return this.UserService.updatedProfile(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', ValidationPipe) id: string) {
    return this.UserService.delete(id);
  }
}
