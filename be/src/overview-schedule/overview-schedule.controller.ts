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
import { CreateScheduleDTO } from './dto/createSchedule.dto';
import { Request, Response } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';

@ApiTags('schedule')
@Controller('schedule')
export class OverviewScheduleController {
  constructor(private overviewScheduleService: OverviewScheduleService) {}

  @Post('register-schedule-by-doctor')
  @UseGuards(PermissionsGuard)
  async registerSchedule(
    @Body() createScheduleDTO: CreateScheduleDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      createScheduleDTO.idDoctor = req.user['_id'];
      const data =
        await this.overviewScheduleService.registerSchedule(createScheduleDTO);
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

  @Delete('delete-schedule-by-doctor/:id')
  @UseGuards(PermissionsGuard)
  async deleteScheduleByDoctor(@Res() res: Response, @Param('id') id: string) {
    try {
      const data =
        await this.overviewScheduleService.deleteScheduleByDoctor(id);
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
}
