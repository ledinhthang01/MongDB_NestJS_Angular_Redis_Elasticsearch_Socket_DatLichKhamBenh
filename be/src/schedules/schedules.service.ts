import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedules } from './enity/schedules.enity';
import { Model, Types } from 'mongoose';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ServerError } from 'src/utils/exception';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedules.name)
    private schedulesModel: Model<Schedules>,
    private elasticService: ElasticsearchService,
  ) {}

  async createSchedule(time: any, data: any, idParent: string): Promise<any> {
    for (
      let date = new Date(data.dateStart);
      date <= new Date(data.dateEnd);
      date.setDate(date.getDate() + 1)
    ) {
      const dataTemp = time.map(async (item) => {
        const timeStart = new Date(date);
        timeStart.setHours(
          parseInt(item.timeStart.hour),
          parseInt(item.timeStart.minute),
          0,
          0,
        );
        const timeEnd = new Date(date);
        timeEnd.setHours(
          parseInt(item.timeEnd.hour),
          parseInt(item.timeEnd.minute),
          0,
          0,
        );
        const temp = JSON.parse(
          JSON.stringify(
            await this.schedulesModel.create({
              time: item.type,
              type: data.type,
              timeStart: timeStart,
              timeEnd: timeEnd,
              date: date,
              idDoctor: new Types.ObjectId(data.idDoctor),
              idCenter: new Types.ObjectId(data.idCenter),
              idParent: new Types.ObjectId(idParent),
            }),
          ),
        );
        const id = temp._id;
        delete temp._id;

        const dataElastic = await this.elasticService.create({
          index: 'schedules',
          id,
          body: temp,
        });

        if (!dataElastic) {
          throw new ServerError('Something went wrong!');
        }
        return temp;
      });
      await Promise.all(dataTemp);
    }
    return true;
  }

  // async getAllSchedule(id: string): Promise<any> {
  //   const data = await this.elasticService.search({
  //     index: 'schedules',
  //     body: {
  //       query: {
  //         match: {
  //           idParent: id,
  //         },
  //       },
  //     },
  //   });
  //   return data;
  // }
}
