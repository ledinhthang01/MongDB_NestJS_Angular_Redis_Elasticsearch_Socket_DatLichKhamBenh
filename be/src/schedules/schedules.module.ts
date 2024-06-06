import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { RoleModule } from 'src/role/role.module';
import { PermissionResourcesModule } from 'src/permission_resources/permission_resources.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedules, SchedulesSchema } from './enity/schedules.enity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    MongooseModule.forFeature([
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
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
