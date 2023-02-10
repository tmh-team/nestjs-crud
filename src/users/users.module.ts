import { Blog } from './../typeorm/entities/Blog';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from 'src/typeorm/entities/User';
import { Profile } from 'src/typeorm/entities/Profile';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Blog])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
