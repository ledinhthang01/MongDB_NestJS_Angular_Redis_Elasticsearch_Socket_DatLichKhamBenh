import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be left blank' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email cannot be left blank' })
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

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
  @IsString()
  @Expose()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  gender: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @Expose()
  roleId: string;
}
