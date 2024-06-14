import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  preview: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  done: boolean;
}
