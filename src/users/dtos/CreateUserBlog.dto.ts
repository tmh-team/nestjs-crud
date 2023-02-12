import { IsNotEmpty } from 'class-validator';

export class CreateUserBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
