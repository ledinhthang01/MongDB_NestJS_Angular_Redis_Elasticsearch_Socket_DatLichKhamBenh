import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { BookingService } from './booking.service';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { EventGateway } from 'src/event.gateway';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(
    private bookingService: BookingService,
    @Inject(EventGateway) private eventGateway: EventGateway,
  ) {}

  @Get('get-all/')
  async getBooking(@Res() res: Response, @Query() query: any) {
    try {
      const data = await this.bookingService.getBooking(query);
      handleSendRequest(res, 'Get successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('scheduleBooking/')
  async getScheduleBooking(@Res() res: Response, @Query() query: any) {
    try {
      const data = await this.bookingService.getScheduleBooking(query);
      handleSendRequest(res, 'Get successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('getDatesAuthed/:id')
  async getDatesAuthed(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.bookingService.getDatesAuthed(id);
      handleSendRequest(res, 'Get successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('userBooking/:id')
  async userBooking(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') idSchedule: string,
  ) {
    try {
      const data = await this.bookingService.userBooking({
        idSubscriber: req.user['_id'],
        idSchedule: idSchedule,
      });
      console.log(data['_id']);

      handleSendRequest(res, 'Booking successfully', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
