import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class DownloadImageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  idParent: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  url: string;
}
