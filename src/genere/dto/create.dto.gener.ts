import { IsString } from 'class-validator';

export class CreateGenereDto {
  @IsString()
  name: string;
  @IsString()
  slug: string;
  @IsString()
  descripton: string;
  @IsString()
  icon: string;
}
