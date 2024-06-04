import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'src/utils/utils';
import { Response } from 'express';
import { CreateCenterDTO } from './dto/createNewCenter.dto';
import { ID_ROLE_CENTER } from 'src/utils/constants';
import { PermissionsGuard } from 'src/guard/permissions.guard';

@ApiTags('center')
@Controller('center')
export class CenterController {
  constructor(private usersService: UsersService) {}

  @Post('create-new-center')
  @UseGuards(PermissionsGuard)
  async createCenter(
    @Body() createCenterDTO: CreateCenterDTO,
    @Res() res: Response,
  ) {
    try {
      createCenterDTO.roleId = ID_ROLE_CENTER;
      const data = await this.usersService.create(createCenterDTO);
      res.status(HttpStatusCode.INSERT_OK).send({
        message: 'Create new center successfully!',
        data: data,
      });
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
