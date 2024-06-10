import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, query } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { BookingService } from './booking.service';
import { PermissionsGuard } from 'src/guard/permissions.guard';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

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
}
