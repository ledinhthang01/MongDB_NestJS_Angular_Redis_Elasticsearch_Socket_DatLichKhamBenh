import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { handleSendRequest } from 'src/utils/utils';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'testtssss' })
  async test(@Req() req: Request, @Res() res: Response) {
    console.log(req.url);
    handleSendRequest(res, 'get success', HttpStatus.OK, 'data 123456');
  }
}
