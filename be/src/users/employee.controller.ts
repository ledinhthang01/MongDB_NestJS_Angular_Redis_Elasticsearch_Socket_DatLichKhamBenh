import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { Response } from 'express';
import { ID_ROLE_EMPLOYEE } from 'src/utils/constants';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { Types } from 'mongoose';
import { CreateEmployeeDTO } from './dto/createEmployee.dto';
import { EditEmployeeDTO } from './dto/editEmployee.dto';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private usersService: UsersService) {}

  @Post('create-new-employee')
  @UseGuards(PermissionsGuard)
  async createEmployee(
    @Body() createEmployeeDTO: CreateEmployeeDTO,
    @Res() res: Response,
  ) {
    try {
      createEmployeeDTO.roleId = new Types.ObjectId(ID_ROLE_EMPLOYEE);
      const data = await this.usersService.create(createEmployeeDTO);
      handleSendRequest(
        res,
        'Create new employee successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-all-employee/')
  @UseGuards(PermissionsGuard)
  async getAllEmployees(@Query() query: any, @Res() res: Response) {
    try {
      const data = await this.usersService.getAll(query, ID_ROLE_EMPLOYEE);
      handleSendRequest(res, 'All employees!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('edit-infor-employee')
  @UseGuards(PermissionsGuard)
  async editInforEmployee(
    @Body() editEmployeeDTO: EditEmployeeDTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.editInfor(editEmployeeDTO);
      handleSendRequest(
        res,
        'Edit employee successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-detail-infor-employee/:id')
  @UseGuards(PermissionsGuard)
  async getDetailInforEmployee(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.usersService.findUserById(id);
      handleSendRequest(
        res,
        'Get detail infor employee successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-employee/:id')
  @UseGuards(PermissionsGuard)
  async deleteEmployee(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.usersService.deleteData(id);
      handleSendRequest(
        res,
        'Delete employee successfully!',
        HttpStatusCode.OK,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
