import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Users' })
  sender: Types.ObjectId;

  @Prop({ trim: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Chat' })
  chat: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }] })
  readBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
