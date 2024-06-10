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

@Injectable()
export class OverviewScheduleService {
  constructor(
    @InjectModel(OverViewSchedules.name)
    private overViewSchedulesModel: Model<OverViewSchedules>,
    private elasticService: ElasticsearchService,
    @InjectQueue('auth-schedules')
    private auth: Queue,
  ) {}

  async registerSchedule(scheduleDTO: ScheduleDTO): Promise<any> {
    const dataDoctor = await this.elasticService.search({
      index: 'users',
      body: {
        query: {
          term: { _id: scheduleDTO.idDoctor },
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

    const schedules = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: {
          bool: {
            must: [
              { term: { idDoctor: scheduleDTO.idDoctor.toString() } },
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              dateStart: {
                                lte: scheduleDTO.dateEnd.toString(),
                                gt: scheduleDTO.dateStart.toString(),
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              dateEnd: {
                                gte: scheduleDTO.dateStart.toString(),
                                lt: scheduleDTO.dateEnd.toString(),
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              dateStart: {
                                lt: scheduleDTO.dateStart.toString(),
                              },
                            },
                          },
                          {
                            range: {
                              dateEnd: {
                                gt: scheduleDTO.dateEnd.toString(),
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            term: {
                              dateStart: scheduleDTO.dateStart.toString(),
                            },
                          },
                          {
                            term: {
                              dateEnd: scheduleDTO.dateEnd.toString(),
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    });

    if (schedules.hits.total['value'] !== 0) {
      throw new XAlreadyExists('Schedules');
    }

    scheduleDTO.idCenter = new Types.ObjectId(
      dataDoctor.hits.hits[0]._source['centerId'],
    );

    const data = JSON.parse(
      JSON.stringify(await this.overViewSchedulesModel.create(scheduleDTO)),
    );

    if (!data) {
      throw new ServerError('Something went wrong!');
    }

    const id = data['_id'];
    delete data['_id'];

    const dataElastic = await this.elasticService.create({
      index: 'overview_schedules',
      id,
      body: data,
    });

    if (!dataElastic) {
      throw new ServerError('Something went wrong!');
    }

    data._id = id;
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

    const query = {
      bool: {
        must: [],
      },
    };

    if (auth) {
      query.bool.must.push({
        match: { auth: auth === 'false' ? false : true },
      });
    }

    if (idDoctor) {
      query.bool.must.push({ term: { idDoctor: idDoctor } });
    }

    if (idCenter) {
      query.bool.must.push({ term: { idCenter: idCenter } });
    }

    const search = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: query,
        from: (page - 1) * size,
        size: size,
      },
    });

    const total = search.hits.total['value'];

    return {
      page,
      size: search.hits.hits.length,
      auth,
      data: search.hits.hits,
      total,
    };
  }

  async editScheduleByDoctor(
    editScheduleDTO: EditScheduleDTO,
    idDoctor: any,
  ): Promise<any> {
    const data = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: {
          term: {
            _id: editScheduleDTO.id,
          },
        },
      },
    });
    if (data.hits.total['value'] === 0) {
      throw new XNotFound('Schedule');
    }

    if (data.hits.hits[0]._source['auth'] === true) {
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

    const schedules = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: {
          bool: {
            must: [
              { term: { idDoctor: idDoctor.toString() } },
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              dateStart: {
                                lte: editScheduleDTO.dateEnd.toString(),
                                gt: editScheduleDTO.dateStart.toString(),
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              dateEnd: {
                                gte: editScheduleDTO.dateStart.toString(),
                                lt: editScheduleDTO.dateEnd.toString(),
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              dateStart: {
                                lt: editScheduleDTO.dateStart.toString(),
                              },
                            },
                          },
                          {
                            range: {
                              dateEnd: {
                                gt: editScheduleDTO.dateEnd.toString(),
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            term: {
                              dateStart: editScheduleDTO.dateStart.toString(),
                            },
                          },
                          {
                            term: {
                              dateEnd: editScheduleDTO.dateEnd.toString(),
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            must_not: { term: { _id: editScheduleDTO.id.toString() } },
          },
        },
      },
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

    const updateElastic = await this.elasticService.update({
      index: 'overview_schedules',
      id: id.toString(),
      body: {
        doc: editScheduleDTO,
      },
    });

    if (!updateElastic) {
      throw new ServerError('Something went wrong update!');
    }

    return updateDB;
  }

  async getDetailScheduleByDoctor(id: string): Promise<any> {
    const search = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: {
          term: {
            _id: id,
          },
        },
      },
    });

    let result = search.hits.hits[0];

    if (!result) {
      throw new XNotFound('Schedule');
    }
    return result;
  }

  async deleteSchedule(id: string): Promise<any> {
    const data = await this.overViewSchedulesModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new ServerError('Something went wrong delete!');
    }
    const dataElastic = await this.elasticService.delete({
      index: 'overview_schedules',
      id: id,
    });
    if (!dataElastic) {
      throw new ServerError('Something went wrong delete!');
    }
    return dataElastic;
  }

  async authSchedule(id: string): Promise<any> {
    const data = await this.elasticService.search({
      index: 'overview_schedules',
      body: {
        query: {
          term: {
            _id: id,
          },
        },
      },
    });

    if (data.hits.total['value'] === 0) {
      throw new XNotFound('Schedule');
    }

    if (data.hits.hits[0]._source['auth'] === true) {
      throw new ServerError('Can not auth schedule!');
    }

    const schedules = data.hits.hits[0]._source;
    id = data.hits.hits[0]._id;

    if (schedules['type'] === 'allday') {
      await this.auth.add(
        'generate',
        {
          time: TIME_FOR_ALLDAY,
          data: schedules,
          idParent: id,
        },
        {
          removeOnComplete: true,
        },
      );
    } else if (schedules['type'] === 'morning') {
      await this.auth.add(
        'generate',
        {
          time: TIME_FOR_MORNING,
          data: schedules,
          idParent: id,
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
          data: schedules,
          idParent: id,
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

    const updateElastic = await this.elasticService.update({
      index: 'overview_schedules',
      id: id,
      body: {
        doc: {
          auth: true,
        },
      },
    });

    if (!updateElastic) {
      throw new ServerError('Something went wrong!');
    }

    return true;
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

    const query = {
      bool: {
        must: [],
      },
    };

    if (subscribed) {
      query.bool.must.push({
        match: { subscribed: subscribed === 'false' ? false : true },
      });
    }

    if (idDoctor) {
      query.bool.must.push({ term: { idDoctor: idDoctor } });
    }

    if (idCenter) {
      query.bool.must.push({ term: { idCenter: idCenter } });
    }

    if (date) {
      query.bool.must.push({
        match: { date: date },
      });
    }

    if (currentTime) {
      query.bool.must.push({
        range: {
          timeStart: { gt: currentTime },
        },
      });
    }

    const search = await this.elasticService.search({
      index: 'schedules',
      body: {
        query: query,
        from: (page - 1) * size,
        size: size,
      },
    });

    const total = search.hits.total['value'];

    return {
      page,
      size: search.hits.hits.length,
      subscribed,
      idDoctor,
      idCenter,
      date,
      data: search.hits.hits,
      total,
    };
  }

  // async deleteScheduleByDoctorTest(id: string): Promise<any> {
  //   const data = await this.elasticService.delete({
  //     index: 'overview_schedules',
  //     id: id,
  //   });
  //   return data;
  // }
}
