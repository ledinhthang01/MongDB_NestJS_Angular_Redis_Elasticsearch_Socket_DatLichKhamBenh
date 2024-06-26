import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupChat {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  chatName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  users: Array<Types.ObjectId>;

  @ApiProperty()
  @Expose()
  isGroupChat: Boolean;

  @ApiProperty()
  @Expose()
  groupAdmin: any;
}
