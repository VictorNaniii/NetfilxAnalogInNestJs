import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UpdatedUserDto {
  @IsEmail()
  email: string;

  password?: string;

  isAdmin?: boolean;
}
