import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/enity/users.enity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RolesSchema, roles } from 'src/role/enity/role.enity';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';
import { RoleModule } from 'src/role/role.module';
import { PermissionResourcesModule } from 'src/permission_resources/permission_resources.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: roles.name, schema: RolesSchema },
    ]),
    EventEmitterModule.forRoot(),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailConsumer],
  exports: [AuthService],
})
export class AuthModule {}
