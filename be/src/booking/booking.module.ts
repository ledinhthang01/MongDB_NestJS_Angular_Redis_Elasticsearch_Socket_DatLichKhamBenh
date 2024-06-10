import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { RoleModule } from 'src/role/role.module';
import { PermissionResourcesModule } from 'src/permission_resources/permission_resources.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OverViewSchedules,
  OverViewSchedulesSchema,
} from 'src/overview-schedule/enity/overview-schedule.enity';
import {
  Schedules,
  SchedulesSchema,
} from 'src/schedules/enity/schedules.enity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    MongooseModule.forFeature([
      { name: OverViewSchedules.name, schema: OverViewSchedulesSchema },
      { name: Schedules.name, schema: SchedulesSchema },
    ]),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
