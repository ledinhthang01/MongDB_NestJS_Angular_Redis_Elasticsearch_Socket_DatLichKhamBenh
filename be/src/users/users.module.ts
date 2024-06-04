import { Module } from '@nestjs/common';
import { CenterController } from './center.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './enity/users.enity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RoleModule } from 'src/role/role.module';
import { PermissionResourcesModule } from 'src/permission_resources/permission_resources.module';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
  ],
  controllers: [CenterController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
