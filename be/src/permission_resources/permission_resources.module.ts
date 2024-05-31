import { Module } from '@nestjs/common';
import { PermissionResourcesController } from './permission_resources.controller';
import { PermissionResourcesService } from './permission_resources.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  permission_resources,
  permission_resourcesSchema,
} from './enity/permission_resources.enity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: permission_resources.name, schema: permission_resourcesSchema },
    ]),
  ],
  controllers: [PermissionResourcesController],
  providers: [PermissionResourcesService],
})
export class PermissionResourcesModule {}
