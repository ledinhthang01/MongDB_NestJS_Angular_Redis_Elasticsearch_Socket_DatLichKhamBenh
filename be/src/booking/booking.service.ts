import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OverViewSchedules } from 'src/overview-schedule/enity/overview-schedule.enity';
import { Schedules } from 'src/schedules/enity/schedules.enity';
import { MAX_RECORDS } from 'src/utils/constants';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(OverViewSchedules.name)
    private overViewSchedulesModel: Model<OverViewSchedules>,
    @InjectModel(Schedules.name)
    private schedulesModel: Model<Schedules>,
    private elasticService: ElasticsearchService,
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

    const isToday =
      now.getDate() === searchDate.getDate() &&
      now.getMonth() === searchDate.getMonth() &&
      now.getFullYear() === searchDate.getFullYear();

    const search: any = {
      bool: {
        must: [
          { term: { idParent } },
          { term: { idDoctor } },
          { term: { date: searchDate.toISOString().split('T')[0] } },
          { term: { subscribed: false } },
        ],
      },
    };

    if (isToday) {
      search.bool.must.push({ range: { timeStart: { gt: now } } });
    }

    const data = await this.elasticService.search({
      index: 'schedules',
      body: {
        query: search,
        sort: [{ timeStart: 'asc' }],
      },
    });

    return data.hits.hits;
  }

  async getDatesAuthed(idDoctor: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: {
          bool: {
            must: [
              { term: { idDoctor: idDoctor } },
              { term: { auth: true } },
              {
                bool: {
                  should: [
                    { range: { dateStart: { gte: today.toISOString() } } },
                    {
                      bool: {
                        must: [
                          {
                            range: { dateStart: { lte: today.toISOString() } },
                          },
                          { range: { dateEnd: { gte: today.toISOString() } } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        sort: [{ dateStart: 'asc' }],
      },
    });

    const schedules: any = data.hits.hits.map((hit) => hit._source);

    let dates = [];
    schedules.forEach((schedule) => {
      let currentDate = new Date(schedule.dateStart);
      const dateEnd = new Date(schedule.dateEnd);
      while (currentDate <= dateEnd) {
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
}
