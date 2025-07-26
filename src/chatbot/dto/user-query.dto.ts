import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UseryQueryDto {
  @ApiProperty({
    description: 'User query in natural language',
    example: "I'm looking for a phone",
  })
  @IsString()
  query: string;
}
