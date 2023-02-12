import * as fs from 'fs';
import { CreateUserBlogDto } from './../../dtos/CreateUserBlog.dto';
import { CreateUserProfileDto } from './../../dtos/CreateUserProfile.dto';
import { UpdateUserDto } from './../../dtos/UpdateUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { bcryptPassword } from 'src/utils/bcrypt';
import { Profile } from 'src/typeorm/entities/Profile';
import { Blog } from 'src/typeorm/entities/Blog';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private userProfileRepository: Repository<Profile>,
    @InjectRepository(Blog) private userBlogRepository: Repository<Blog>,
  ) {}

  getUsers() {
    return this.userRepository.find({ relations: ['profile', 'blogs'] });
  }

  createUser(user: CreateUserDto, avatar: string): Promise<User> {
    const password = bcryptPassword(user.password);
    const newUser = this.userRepository.create({
      ...user,
      password,
      avatar,
    });

    return this.userRepository.save(newUser);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    file: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const password = updateUserDto.password
      ? bcryptPassword(updateUserDto.password)
      : user.password;

    let avatar = user.avatar;
    if (file) {
      fs.unlink(`upload/image/${avatar}`, (error) => {
        if (error) {
          return error;
        }
      });

      avatar = file;
    }

    this.userRepository.update({ id }, { ...updateUserDto, password, avatar });

    return await this.userRepository.findOneByOrFail({ id });
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['profile'],
    });

    if (user.avatar) {
      fs.unlink(`upload/image/${user.avatar}`, (error) => {
        if (error) {
          return error;
        }
      });
    }

    if (user.profile) {
      this.userProfileRepository.delete(user.profile.id);
    }

    this.userRepository.delete(user.id);
  }

  async createUserProfile(
    id: number,
    createUserDto: CreateUserProfileDto,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    user.profile = await this.userProfileRepository.save(createUserDto);

    return this.userRepository.save(user);
  }

  async createUserBlog(
    id: number,
    createUserBlogDto: CreateUserBlogDto,
  ): Promise<Blog> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const newProfile = this.userBlogRepository.create({
      ...createUserBlogDto,
      user,
    });

    return this.userBlogRepository.save(newProfile);
  }

  async findAvatar(id: number): Promise<String> {
    const user = await this.userRepository.findOneBy({ id });

    return user.avatar;
  }
}
