import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: false })
  avatar: string;

  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  preview: string;

  @Prop({ required: false })
  content: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Users' })
  idAuthor: Types.ObjectId;

  @Prop({ default: false })
  done: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
