import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AccessChatDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  userId: Types.ObjectId;
}
