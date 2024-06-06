import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OverViewSchedules } from './enity/overview-schedule.enity';
import { Model } from 'mongoose';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CreateScheduleDTO } from './dto/createSchedule.dto';

@Injectable()
export class OverviewScheduleService {
  constructor(
    @InjectModel(OverViewSchedules.name)
    private usersModel: Model<OverViewSchedules>,
    private elasticService: ElasticsearchService,
  ) {}

  async registerSchedule(createScheduleDTO: CreateScheduleDTO): Promise<any> {
    console.log(createScheduleDTO);
    return true;
  }
}
