import { IsString } from 'class-validator';

export class UseryQueryDto {
  @IsString()
  query: string;
}
