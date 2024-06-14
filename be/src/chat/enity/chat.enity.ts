import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ trim: true })
  chatName: string;

  @Prop({ default: false })
  isGroupChat: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }] })
  users: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  latestMessage: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  groupAdmin: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
