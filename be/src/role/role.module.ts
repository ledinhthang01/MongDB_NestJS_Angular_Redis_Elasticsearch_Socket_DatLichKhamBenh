import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesSchema, roles } from './enity/role.enity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: roles.name, schema: RolesSchema }]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
