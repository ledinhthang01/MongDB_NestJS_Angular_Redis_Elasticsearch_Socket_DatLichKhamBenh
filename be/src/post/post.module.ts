import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { RoleModule } from 'src/role/role.module';
import { PermissionResourcesModule } from 'src/permission_resources/permission_resources.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './enity/post.enity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Media, MediaSchema } from 'src/media/enity/media.enity';

@Module({
  imports: [
    RoleModule,
    PermissionResourcesModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Media.name, schema: MediaSchema },
    ]),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
