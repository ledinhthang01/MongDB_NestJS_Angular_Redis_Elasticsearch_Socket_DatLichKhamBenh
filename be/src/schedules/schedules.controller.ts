import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { Response } from 'express';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  // @Get('get-all-schedules/:id')
  // async getAllSchedule(@Res() res: Response, @Param('id') id: string) {
  //   try {
  //     const data = await this.schedulesService.getAllSchedule(id);
  //     handleSendRequest(
  //       res,
  //       'Get all schedules successfully!',
  //       HttpStatusCode.OK,
  //       data,
  //     );
  //   } catch (error) {
  //     res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
  //   }
  // }
}
