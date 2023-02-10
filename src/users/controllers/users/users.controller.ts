import { CreateUserBlogDto } from './../../dtos/CreateUserBlog.dto';
import { CreateUserProfileDto } from './../../dtos/CreateUserProfile.dto';
import { UpdateUserDto } from './../../dtos/UpdateUser.dto';
import { CreateUserDto } from './../../dtos/CreateUser.dto';
import { UsersService } from './../../services/users/users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @Post(':id/profiles')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfile: CreateUserProfileDto,
  ) {
    return this.userService.createUserProfile(id, createUserProfile);
  }

  @Post(':id/blogs')
  createUserBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserBlog: CreateUserBlogDto,
  ) {
    return this.userService.createUserBlog(id, createUserBlog);
  }
}
