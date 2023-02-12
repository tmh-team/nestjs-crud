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
  Res,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UseInterceptors } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

const storage = {
  storage: diskStorage({
    destination: './upload/image',
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0];
      const fileExtension = file.originalname.split('.')[1];
      const newFileName =
        name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

      callback(null, newFileName);
    },
  }),
};

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar', storage))
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let filename = file ? file.filename : null;

    return this.userService.createUser(createUserDto, filename);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', storage))
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let filename = file ? file.filename : null;

    return this.userService.updateUser(id, updateUserDto, filename);
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

  @Get(':id/avatar')
  async findAvatar(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const avatar = await this.userService.findAvatar(id);

    return res.sendFile(join(process.cwd(), 'upload/image/' + avatar));
  }
}
