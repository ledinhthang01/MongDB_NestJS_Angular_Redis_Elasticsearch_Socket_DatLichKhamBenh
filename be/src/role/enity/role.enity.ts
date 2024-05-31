import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type UserDocument = HydratedDocument<roles>;

@Schema({ timestamps: true })
export class roles {
  @Prop({ required: true })
  roleName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'permission_resources' }] })
  permissionResources: Types.ObjectId[];
}

export const RolesSchema = SchemaFactory.createForClass(roles);
