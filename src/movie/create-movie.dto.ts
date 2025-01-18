import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;
  @IsString()
  contry: string;
}

export class CreateMovieDto {
  @IsString()
  slug: string;

  @IsString()
  poster: string;

  @IsString()
  bigposter: string;

  @IsString()
  title: string;

  @IsString()
  parameters?: Parameters;

  @IsString()
  videoUrl: string;

  @IsArray()
  @IsString({ each: true })
  generes: string[];

  @IsArray()
  @IsString({ each: true })
  actors: string[];

  @IsBoolean()
  isSendTelegram?: boolean;
}
