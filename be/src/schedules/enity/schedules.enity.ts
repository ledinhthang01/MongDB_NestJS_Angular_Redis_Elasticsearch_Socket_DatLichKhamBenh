import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type SchedulesDocument = HydratedDocument<Schedules>;

@Schema({ timestamps: true })
export class Schedules {
  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  timeStart: Date;

  @Prop({ required: false })
  timeEnd: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'OverViewSchedules' })
  idParent: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  idDoctor: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  idCenter: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Users' })
  idSubscriber: Types.ObjectId;

  @Prop({ required: false, default: false })
  subscribed: boolean;

  @Prop({ required: false, default: '200' })
  price: string;

  @Prop({ required: false, default: false })
  done: boolean;
}

export const SchedulesSchema = SchemaFactory.createForClass(Schedules);
