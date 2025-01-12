import { IsString, isString } from 'class-validator';

export class RefresDto {
  @IsString({
    message: 'You did not pass refresh token or it is not a stirng',
  })
  refreshToken: string;
}
