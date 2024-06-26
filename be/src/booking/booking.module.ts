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
import { AuthModule } from 'src/auth/auth.module';
import { EventGateway } from 'src/event.gateway';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: OverViewSchedules.name, schema: OverViewSchedulesSchema },
      { name: Schedules.name, schema: SchedulesSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, EventGateway],
})
export class BookingModule {}
