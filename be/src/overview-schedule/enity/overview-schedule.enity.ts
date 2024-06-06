import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type OverViewSchedulesDocument = HydratedDocument<OverViewSchedules>;

@Schema({ timestamps: true })
export class OverViewSchedules {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  idDoctor: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  idCenter: Types.ObjectId;

  @Prop({ required: false, default: false })
  auth: Boolean;
}

export const OverViewSchedulesSchema =
  SchemaFactory.createForClass(OverViewSchedules);
