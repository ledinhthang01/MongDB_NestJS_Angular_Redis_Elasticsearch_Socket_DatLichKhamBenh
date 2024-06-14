import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionResourcesModule } from './permission_resources/permission_resources.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'process';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SchedulesModule } from './schedules/schedules.module';
import { OverviewScheduleModule } from './overview-schedule/overview-schedule.module';
import { BookingModule } from './booking/booking.module';
import { EventGateway } from './event.gateway';
import { MediaModule } from './media/media.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    RoleModule,
    PermissionResourcesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_TOKEN,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    CacheModule.register({
      store: redisStore.create({
        host: 'localhost',
        port: 6379,
      }),
      isGlobal: true,
    }),

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    SchedulesModule,
    OverviewScheduleModule,
    BookingModule,
    MediaModule,
    PostModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/auth/signin',
        '/auth/signup',
        '/employee/signin',
        '/auth/refreshToken',
        '/post/get-all-posts/(.*)',
        '/post/get-detail-post/(.*)',
        '/post/get-latest-post',
        '/schedule/get-schedules/(.*)',
        '/booking/get-all/(.*)',
        '/booking/scheduleBooking/(.*)',
        '/booking/getDatesAuthed/(.*)',
        '/doctor/get-detail-infor-doctor-by-user/(.*)',
        '/center/get-detail-infor-center-by-user/(.*)',
      )
      .forRoutes('*');
  }
}
