import { IsEmail, IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdatedUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
