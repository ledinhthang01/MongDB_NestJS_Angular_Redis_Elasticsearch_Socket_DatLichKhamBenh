import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { Request, Response } from 'express';
import { ID_ROLE_DOCTOR } from 'src/utils/constants';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { Types } from 'mongoose';
import { CreateDoctorDTO } from './dto/createDoctor.dto';
import { EditDoctorDTO } from './dto/editDoctor.dto';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private usersService: UsersService) {}

  @Post('create-new-doctor')
  @UseGuards(PermissionsGuard)
  async createDoctor(
    @Body() createDoctorDTO: CreateDoctorDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      createDoctorDTO.roleId = new Types.ObjectId(ID_ROLE_DOCTOR);
      createDoctorDTO.centerId = req.user['_id'];
      const data = await this.usersService.create(createDoctorDTO);
      handleSendRequest(
        res,
        'Create new doctor successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-all-doctor/')
  @UseGuards(PermissionsGuard)
  async getAllDoctors(
    @Query() query: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const data = await this.usersService.getAll(
        query,
        ID_ROLE_DOCTOR,
        req.user['_id'],
      );
      handleSendRequest(res, 'All doctors!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('edit-infor-doctor')
  @UseGuards(PermissionsGuard)
  async editInforDoctor(
    @Body() editDoctorDTO: EditDoctorDTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.editInfor(editDoctorDTO);
      handleSendRequest(
        res,
        'Edit center successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-detail-infor-doctor/:id')
  @UseGuards(PermissionsGuard)
  async getDetailInforDoctor(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.usersService.findUserById(id);
      handleSendRequest(
        res,
        'Get detail infor doctor successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-doctor/:id')
  @UseGuards(PermissionsGuard)
  async deleteDoctor(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.usersService.deleteData(id);
      handleSendRequest(res, 'Delete doctor successfully!', HttpStatusCode.OK);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-detail-infor-doctor-by-user/:id')
  async getDetailInforDoctorByUser(
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const data = await this.usersService.findUserById(id);
      const {
        active,
        dateOfBirth,
        email,
        gender,
        joiningDate,
        password,
        refreshToken,
        roleId,
        ...filtered
      } = data._source;
      handleSendRequest(
        res,
        'Get detail infor center successfully!',
        HttpStatusCode.OK,
        filtered,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
