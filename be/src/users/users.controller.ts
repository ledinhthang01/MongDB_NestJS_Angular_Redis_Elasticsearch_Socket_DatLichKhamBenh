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
}
