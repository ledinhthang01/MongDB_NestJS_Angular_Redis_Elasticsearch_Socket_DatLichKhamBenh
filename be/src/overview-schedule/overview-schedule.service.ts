import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OverViewSchedules } from './enity/overview-schedule.enity';
import { Model, Types } from 'mongoose';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ScheduleDTO } from './dto/schedule.dto';
import { ServerError, XAlreadyExists, XNotFound } from 'src/utils/exception';
import {
  MAX_RECORDS,
  TIME_FOR_AFTERNOON,
  TIME_FOR_ALLDAY,
  TIME_FOR_MORNING,
} from 'src/utils/constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EditScheduleDTO } from './dto/editSchedule.dto';
import { Schedules } from 'src/schedules/enity/schedules.enity';

@Injectable()
export class OverviewScheduleService {
  constructor(
    @InjectModel(OverViewSchedules.name)
    private overViewSchedulesModel: Model<OverViewSchedules>,
    @InjectModel(Schedules.name)
    private schedulesModel: Model<Schedules>,
    private elasticService: ElasticsearchService,
    @InjectQueue('auth-schedules')
    private auth: Queue,
  ) {}

  async registerSchedule(scheduleDTO: ScheduleDTO): Promise<OverViewSchedules> {
    const idDoctor = scheduleDTO.idDoctor;
    const dataDoctor = await this.elasticService.search({
      index: 'users',
      body: {
        query: {
          term: { _id: idDoctor },
        },
      },
    });

    if (!dataDoctor) {
      throw new XNotFound('User');
    }

    const DateStart = new Date(scheduleDTO.dateStart);
    const DateEnd = new Date(scheduleDTO.dateEnd);
    const now = new Date();

    if (
      DateStart.getDate() < now.getDate() + 2 ||
      DateEnd.getDate() > now.getDate() + 11
    ) {
      throw new ServerError('Input incorect');
    }

    const schedules = await this.overViewSchedulesModel.findOne({
      idDoctor,
      $or: [
        { dateStart: { $lte: DateEnd, $gt: DateStart } },
        { dateEnd: { $gte: DateStart, $lt: DateEnd } },
        {
          $and: [
            { dateStart: { $lt: DateStart } },
            { dateEnd: { $gt: DateEnd } },
          ],
        },
        {
          $and: [
            { dateStart: { $eq: DateStart } },
            { dateEnd: { $eq: DateEnd } },
          ],
        },
      ],
    });

    if (schedules) {
      throw new XAlreadyExists('Schedules');
    }

    scheduleDTO.idCenter = new Types.ObjectId(
      dataDoctor.hits.hits[0]._source['centerId'],
    );

    const data = await this.overViewSchedulesModel.create(scheduleDTO);

    if (!data) {
      throw new ServerError('Something went wrong!');
    }

    return data;
  }

  async getOverviewSchedules(
    data: any,
    idDoctor?: string,
    idCenter?: string,
  ): Promise<any> {
    let { page = '', size = '', auth = '' } = data;

    page = parseInt(page);
    size = parseInt(size);

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const query: any = {};
    if (idDoctor) query.idDoctor = new Types.ObjectId(idDoctor);
    if (idCenter) query.idCenter = new Types.ObjectId(idCenter);
    if (auth) query.auth = auth === 'false' ? false : true;

    const total = await this.overViewSchedulesModel.countDocuments(query);

    const result = await this.overViewSchedulesModel.aggregate([
      { $match: query },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    return {
      page,
      size: result.length,
      auth,
      total,
      data: result,
    };
  }

  async editScheduleByDoctor(
    editScheduleDTO: EditScheduleDTO,
    idDoctor: any,
  ): Promise<OverViewSchedules> {
    const data = await this.overViewSchedulesModel.findById(editScheduleDTO.id);
    if (!data) {
      throw new XNotFound('Schedule');
    }

    if (data.auth === true) {
      throw new ServerError('You cannot change it!');
    }

    const DateStart = new Date(editScheduleDTO.dateStart);
    const DateEnd = new Date(editScheduleDTO.dateEnd);
    const now = new Date();

    if (
      DateStart.getDate() < now.getDate() + 2 ||
      DateEnd.getDate() > now.getDate() + 11
    ) {
      throw new ServerError('Input incorect');
    }

    const schedules = await this.overViewSchedulesModel.findOne({
      _id: { $ne: editScheduleDTO.id },
      idDoctor,
      $or: [
        { dateStart: { $lte: DateEnd, $gt: DateStart } },
        { dateEnd: { $gte: DateStart, $lt: DateEnd } },
        {
          $and: [
            { dateStart: { $lt: DateStart } },
            { dateEnd: { $gt: DateEnd } },
          ],
        },
        {
          $and: [
            { dateStart: { $eq: DateStart } },
            { dateEnd: { $eq: DateEnd } },
          ],
        },
      ],
    });

    if (schedules) {
      throw new XAlreadyExists('Schedule');
    }

    const id = editScheduleDTO.id;
    delete editScheduleDTO.id;
    const updateDB = await this.overViewSchedulesModel.findByIdAndUpdate(
      id,
      editScheduleDTO,
      { new: true },
    );

    if (!updateDB) {
      throw new ServerError('Something went wrong update!');
    }

    return updateDB;
  }

  async getDetailScheduleByDoctor(id: string): Promise<OverViewSchedules> {
    const data = await this.overViewSchedulesModel.findById(id);

    if (!data) {
      throw new XNotFound('Schedule');
    }
    return data;
  }

  async deleteSchedule(id: string): Promise<OverViewSchedules> {
    const data = await this.overViewSchedulesModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new ServerError('Something went wrong delete!');
    }

    return data;
  }

  async authSchedule(id: string): Promise<OverViewSchedules> {
    const data = await this.overViewSchedulesModel.findById(id);
    if (!data) {
      throw new XNotFound('Schedule');
    }

    if (data.auth === true) {
      throw new ServerError('Can not auth schedule!');
    }

    if (data.type === 'allday') {
      await this.auth.add(
        'generate',
        {
          time: TIME_FOR_ALLDAY,
          data: data,
          idParent: data._id,
        },
        {
          removeOnComplete: true,
        },
      );
    } else if (data.type === 'morning') {
      await this.auth.add(
        'generate',
        {
          time: TIME_FOR_MORNING,
          data: data,
          idParent: data._id,
        },
        {
          removeOnComplete: true,
        },
      );
    } else {
      await this.auth.add(
        'generate',
        {
          time: TIME_FOR_AFTERNOON,
          data: data,
          idParent: data._id,
        },
        {
          removeOnComplete: true,
        },
      );
    }

    const updateDB = await this.overViewSchedulesModel
      .findByIdAndUpdate(id, { auth: true }, { new: true })
      .exec();

    if (!updateDB) {
      throw new ServerError('Something went wrong!');
    }

    return updateDB;
  }

  async getSchedules(data: any): Promise<any> {
    let {
      page = '',
      size = '',
      subscribed = '',
      idDoctor = '',
      idCenter = '',
      date = '',
      currentTime = '',
    } = data;

    page = parseInt(page);
    size = parseInt(size);

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const query: any = {};
    if (idDoctor) query.idDoctor = new Types.ObjectId(idDoctor);
    if (idCenter) query.idCenter = new Types.ObjectId(idCenter);
    if (subscribed) query.subscribed = subscribed === 'false' ? false : true;
    if (date) query.date = new Date(date);
    if (currentTime) query.timeStart = { $gt: new Date(currentTime) };

    const total = await this.schedulesModel.countDocuments(query);

    const result = await this.schedulesModel.aggregate([
      { $match: query },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);
    return {
      page,
      size: result.length,
      subscribed,
      idDoctor,
      idCenter,
      date,
      total,
      data: result,
    };
  }
}
