import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type UserDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({})
  gender: string;

  @Prop({})
  degree: string;

  @Prop({})
  academic: string;

  @Prop({})
  specialties: string;

  @Prop({})
  dateOfBirth: Date;

  @Prop({})
  graduationDate: Date;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  nationality: string;

  @Prop({ default: Date.now })
  joiningDate: Date;

  @Prop()
  university: string;

  @Prop({ default: 'active' })
  active: string;

  @Prop({})
  describe: string;

  @Prop({ default: '/uploads/avatardefault.jpg' })
  avatar: string;

  @Prop({ required: true })
  roleId: string;

  @Prop({})
  refreshToken: string;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  centerId: Types.ObjectId;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
