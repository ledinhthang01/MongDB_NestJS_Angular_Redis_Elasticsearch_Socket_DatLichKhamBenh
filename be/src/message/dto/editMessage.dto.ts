import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class EditMessageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  messageId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  content: string;
}
