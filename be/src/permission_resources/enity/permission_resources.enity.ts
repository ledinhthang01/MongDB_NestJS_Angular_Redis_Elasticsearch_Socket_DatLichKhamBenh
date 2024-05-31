import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type UserDocument = HydratedDocument<permission_resources>;

@Schema({ timestamps: true })
export class permission_resources {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;
}

export const permission_resourcesSchema =
  SchemaFactory.createForClass(permission_resources);
