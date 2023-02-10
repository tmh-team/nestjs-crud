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

  createUser(user: CreateUserDto): Promise<User> {
    const password = bcryptPassword(user.password);
    const newUser = this.userRepository.create({
      ...user,
      password,
    });

    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const password = updateUserDto.password
      ? bcryptPassword(updateUserDto.password)
      : user.password;

    this.userRepository.update({ id }, { ...updateUserDto, password });

    return await this.userRepository.findOneByOrFail({ id });
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
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
}
