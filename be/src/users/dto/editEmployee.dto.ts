import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditEmployeeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Phone number cannot be shorter than 10 characters',
  })
  @MaxLength(12, {
    message: 'Phone number cannot be longer than 12 characters',
  })
  @IsString()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  dateOfBirth: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  nationality: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  joiningDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  active: string;
}
