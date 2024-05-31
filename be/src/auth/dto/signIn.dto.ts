import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email cannot be left blank' })
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password cannot be left blank' })
  @IsString()
  @Expose()
  @MinLength(6, {
    message: 'Password cannot be shorter than 6 characters',
  })
  password: string;
}
