import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class ScheduleDTO {
  @ApiProperty()
  @Expose()
  idDoctor: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  dateStart: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  dateEnd: Date;

  @ApiProperty()
  @Expose()
  idCenter: Types.ObjectId;
}
