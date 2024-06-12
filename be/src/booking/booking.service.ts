import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OverViewSchedules } from 'src/overview-schedule/enity/overview-schedule.enity';
import { Schedules } from 'src/schedules/enity/schedules.enity';
import { MAX_RECORDS } from 'src/utils/constants';
import { ServerError, XNotFound } from 'src/utils/exception';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(OverViewSchedules.name)
    private overViewSchedulesModel: Model<OverViewSchedules>,
    @InjectModel(Schedules.name)
    private schedulesModel: Model<Schedules>,
  ) {}

  async getBooking(data: any): Promise<any> {
    let { page, size } = data;

    page = parseInt(page);
    size = parseInt(size);

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query = {
      dateStart: { $gte: today },
      auth: true,
    };

    const result = await this.overViewSchedulesModel.aggregate([
      { $match: query },
      { $sort: { idDoctor: 1, date: 1 } },
      {
        $group: {
          _id: '$idDoctor',
          dateStart: { $first: '$date' },
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    return result;
  }

  async getScheduleBooking(query: any): Promise<any> {
    let { idParent, idDoctor, date } = query;

    const searchDate = new Date(date);

    const now = new Date();
    if (
      now.getDate() === searchDate.getDate() &&
      now.getMonth() === searchDate.getMonth() &&
      now.getFullYear() === searchDate.getFullYear()
    ) {
      return await this.schedulesModel
        .find({
          idParent: new Types.ObjectId(idParent),
          idDoctor: new Types.ObjectId(idDoctor),
          date: searchDate,
          timeStart: { $gt: now },
          subscribed: false,
        })
        .sort({ timeStart: 1 });
    }

    return await this.schedulesModel
      .find({
        idParent: new Types.ObjectId(idParent),
        idDoctor: new Types.ObjectId(idDoctor),
        date: searchDate,
        subscribed: false,
      })
      .sort({ timeStart: 1 });
  }

  async getDatesAuthed(idDoctor: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedules = await this.overViewSchedulesModel
      .find({
        idDoctor: new Types.ObjectId(idDoctor),
        auth: true,
        $or: [
          { dateStart: { $gte: today } },
          {
            $and: [
              { dateStart: { $lte: today } },
              { dateEnd: { $gte: today } },
            ],
          },
        ],
      })
      .sort({ dateStart: 1 });

    let dates = [];
    schedules.forEach((schedule) => {
      let currentDate = new Date(schedule.dateStart);
      while (currentDate <= schedule.dateEnd) {
        if (currentDate >= today) {
          dates.push({
            date: currentDate.toISOString().split('T')[0],
            idDoctor: schedule.idDoctor,
            idParent: schedule._id,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return dates;
  }

  async userBooking({ idSubscriber, idSchedule }): Promise<Schedules> {
    const data = await this.schedulesModel.findById(
      new Types.ObjectId(idSchedule),
    );

    if (!data) {
      throw new XNotFound('Schedule');
    }

    if (data.subscribed === true) {
      throw new ServerError('The schedule has been booked');
    }

    if (new Date() >= data.timeStart) {
      throw new ServerError('Beyond the specified time');
    }

    const dataUpdate = await this.schedulesModel.findByIdAndUpdate(
      new Types.ObjectId(idSchedule),
      { idSubscriber: idSubscriber, subscribed: true },
      { new: true },
    );

    if (!dataUpdate) {
      throw new ServerError('Something went wrong!');
    }
    return dataUpdate;
  }
}
