import { IsNotEmpty } from 'class-validator';
export class CreateUserProfileDto {
  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  dob: string;
}
