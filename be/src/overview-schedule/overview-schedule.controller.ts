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
import { ApiTags } from '@nestjs/swagger';
import { OverviewScheduleService } from './overview-schedule.service';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { ScheduleDTO } from './dto/schedule.dto';
import { Request, Response } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { EditScheduleDTO } from './dto/editSchedule.dto';

@ApiTags('schedule')
@Controller('schedule')
export class OverviewScheduleController {
  constructor(private overviewScheduleService: OverviewScheduleService) {}

  @Post('register-schedule-by-doctor')
  @UseGuards(PermissionsGuard)
  async registerSchedule(
    @Body() scheduleDTO: ScheduleDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      scheduleDTO.idDoctor = req.user['_id'];
      const data =
        await this.overviewScheduleService.registerSchedule(scheduleDTO);
      handleSendRequest(
        res,
        'Successfully registered for medical examination appointment!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-all-schedules-by-doctor/')
  @UseGuards(PermissionsGuard)
  async getSchedulesByDoctor(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: any,
  ) {
    try {
      const data = await this.overviewScheduleService.getOverviewSchedules(
        query,
        req.user['_id'],
      );
      handleSendRequest(
        res,
        'Get all schedules successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('edit-schedule-by-doctor')
  @UseGuards(PermissionsGuard)
  async editScheduleByDoctor(
    @Res() res: Response,
    @Req() req: Request,
    @Body() editScheduleDTO: EditScheduleDTO,
  ) {
    try {
      const data = await this.overviewScheduleService.editScheduleByDoctor(
        editScheduleDTO,
        req.user['_id'],
      );
      handleSendRequest(
        res,
        'Update schedule successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-detail-schedule-by-doctor/:id')
  async getDetailScheduleByDoctor(
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const data =
        await this.overviewScheduleService.getDetailScheduleByDoctor(id);
      handleSendRequest(
        res,
        'Get detail schedule successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-schedule-by-doctor/:id')
  @UseGuards(PermissionsGuard)
  async deleteScheduleByDoctor(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.overviewScheduleService.deleteSchedule(id);
      handleSendRequest(
        res,
        'Delete schedule successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-all-schedules-by-ad/')
  @UseGuards(PermissionsGuard)
  async getSchedulesByAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: any,
  ) {
    try {
      const data = await this.overviewScheduleService.getOverviewSchedules(
        query,
        '',
        req.user['_id'],
      );
      handleSendRequest(
        res,
        'Get all schedule not auth successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('auth-schedule/:id')
  @UseGuards(PermissionsGuard)
  async authSchedule(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.overviewScheduleService.authSchedule(id);
      handleSendRequest(
        res,
        'Auth schedule successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-schedule-by-ad/:id')
  @UseGuards(PermissionsGuard)
  async deleteScheduleByAd(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.overviewScheduleService.deleteSchedule(id);
      handleSendRequest(
        res,
        'Delete schedule successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-schedules/')
  async getSchedules(@Res() res: Response, @Query() query: any) {
    try {
      const data = await this.overviewScheduleService.getSchedules(query);
      handleSendRequest(
        res,
        'Get all schedules successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
