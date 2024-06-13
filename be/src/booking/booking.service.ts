import { Injectable } from '@nestjs/common';
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

  async getScheduleByUser(query, _id): Promise<any> {
    let { page = '', size = '', done = '' } = query;

    page = parseInt(page);
    size = parseInt(size);

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const search = {
      idSubscriber: _id,
      done: done === 'true',
      subscribed: true,
    };

    const total = await this.schedulesModel.countDocuments(search);

    const data = await this.schedulesModel.aggregate([
      { $match: search },
      {
        $lookup: {
          // Thực hiện lookup để kết nối idDoctor và idCenter với bảng users và lấy ra thông tin chi tiết tương ứng.
          from: 'users',
          localField: 'idDoctor',
          foreignField: '_id',
          as: 'doctorInfo',
          pipeline: [
            //  Sử dụng pipeline trong lookup để chỉ lấy ra các trường cần thiết từ idDoctor.
            {
              $project: {
                name: 1,
                specialties: 1,
                degree: 1,
                academic: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'idCenter',
          foreignField: '_id',
          as: 'centerInfo',
          pipeline: [
            // Sử dụng pipeline trong lookup để chỉ lấy ra các trường cần thiết từ idCenter.
            {
              $project: {
                name: 1,
                address: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$doctorInfo' }, //Chuyển đổi các kết quả lookup từ dạng mảng sang dạng đối tượng.
      { $unwind: '$centerInfo' },
      { $sort: { date: 1, timeStart: 1 } },
      {
        $project: {
          _id: 1,
          time: 1,
          type: 1,
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          price: 1,
          doctorInfo: 1,
          centerInfo: 1,
        },
      },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);
    return { page, size, done, total, data };
  }

  async getScheduleByDoctor(query, _id): Promise<any> {
    let { page = '', size = '', done = '' } = query;

    page = parseInt(page);
    size = parseInt(size);

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const search = {
      idDoctor: _id,
      done: done === 'true',
      subscribed: true,
    };

    const total = await this.schedulesModel.countDocuments(search);

    const data = await this.schedulesModel.aggregate([
      { $match: search },
      {
        $lookup: {
          from: 'users',
          localField: 'idSubscriber',
          foreignField: '_id',
          as: 'userInfo',
          pipeline: [
            {
              $project: {
                name: 1,
                gender: 1,
                dateOfBirth: {
                  $dateToString: { format: '%Y-%m-%d', date: '$dateOfBirth' },
                },
                phoneNumber: 1,
                address: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$userInfo' },
      { $sort: { timeStart: 1 } },
      {
        $project: {
          _id: 1,
          time: 1,
          type: 1,
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          userInfo: 1,
        },
      },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);
    return { page, size, done, total, data };
  }

  async doneSchedule(idSchedule: string): Promise<any> {
    const data = await this.schedulesModel.findByIdAndUpdate(
      idSchedule,
      { done: true },
      { new: true },
    );

    if (!data) {
      throw new XNotFound('Schedule');
    }
    return data._id;
  }
}
