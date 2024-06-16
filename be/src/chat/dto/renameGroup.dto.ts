import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RenameGroupDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  chatName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  chatId: Types.ObjectId;
}
