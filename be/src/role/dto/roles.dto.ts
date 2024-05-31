import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RolesDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  roleName: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @Expose()
  permissionResources: string[];
}
