import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
  @Prop({ type: Number, required: true, unique: true })
  userId: number;

  @Prop({ type: String })
  path: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
