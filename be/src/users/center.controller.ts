import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { Response } from 'express';
import { CreateCenterDTO } from './dto/createNewCenter.dto';
import { ID_ROLE_CENTER } from 'src/utils/constants';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { Types } from 'mongoose';
import { EditCenterDTO } from './dto/editCenter.dto';

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
      createCenterDTO.roleId = new Types.ObjectId(ID_ROLE_CENTER);
      const data = await this.usersService.create(createCenterDTO);
      handleSendRequest(
        res,
        'Create new center successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('edit-infor-center')
  @UseGuards(PermissionsGuard)
  async editInforCenter(
    @Body() editCenterDTO: EditCenterDTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.editInfor(editCenterDTO);
      handleSendRequest(res, 'Edit center successfully!', 200, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-detail-infor-center/:id')
  @UseGuards(PermissionsGuard)
  async getDetailInforCenter(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.usersService.findUserById(id);
      handleSendRequest(
        res,
        'Get detail infor center successfully!',
        200,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-center/:id')
  @UseGuards(PermissionsGuard)
  async deleteCenter(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.usersService.deleteData(id);
      handleSendRequest(res, 'Delete center successfully!', 200, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
