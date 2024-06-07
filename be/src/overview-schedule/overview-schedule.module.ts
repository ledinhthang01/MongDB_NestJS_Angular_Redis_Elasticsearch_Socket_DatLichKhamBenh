import { Module } from '@nestjs/common';
import { OverviewScheduleController } from './overview-schedule.controller';
import { OverviewScheduleService } from './overview-schedule.service';
import { RoleModule } from 'src/role/role.module';
import { PermissionResourcesModule } from 'src/permission_resources/permission_resources.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  OverViewSchedules,
  OverViewSchedulesSchema,
} from './enity/overview-schedule.enity';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { BullModule } from '@nestjs/bull';
import { AuthConsumer } from './consumers/auth.consumer';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    SchedulesModule,
    MongooseModule.forFeature([
      { name: OverViewSchedules.name, schema: OverViewSchedulesSchema },
    ]),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
    BullModule.registerQueue({
      name: 'auth-schedules',
    }),
  ],
  controllers: [OverviewScheduleController],
  providers: [OverviewScheduleService, AuthConsumer],
})
export class OverviewScheduleModule {}
