import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedules } from './enity/schedules.enity';
import { Model, Types } from 'mongoose';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedules.name)
    private schedulesModel: Model<Schedules>,
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
              date: date.setUTCHours(0, 0, 0, 0),
              idDoctor: new Types.ObjectId(data.idDoctor),
              idCenter: new Types.ObjectId(data.idCenter),
              idParent: new Types.ObjectId(idParent),
            }),
          ),
        );
        return temp;
      });
      await Promise.all(dataTemp);
    }
    return true;
  }
}
