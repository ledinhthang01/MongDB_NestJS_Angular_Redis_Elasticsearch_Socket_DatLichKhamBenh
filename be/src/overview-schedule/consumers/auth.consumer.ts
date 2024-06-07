import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SchedulesService } from 'src/schedules/schedules.service';
import { ServerError } from 'src/utils/exception';

@Processor('auth-schedules')
export class AuthConsumer {
  constructor(private mailerService: SchedulesService) {}
  @Process('generate')
  async generateSchedule(job: Job<unknown>) {
    const data = await this.mailerService.createSchedule(
      job.data['time'],
      job.data['data'],
      job.data['idParent'],
    );

    if (!data) {
      throw new ServerError('Something went wrong!');
    }
  }
}
