import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class GroupChatDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  userId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  chatId: Types.ObjectId;
}
