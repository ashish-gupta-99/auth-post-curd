import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class GeoData {
  latitude: string;
  longitude: string;
}

enum postStatusEnum {
  active = 'active',
  inactive = 'inactive',
}

@Schema({ collection: 'posts' })
export class Posts {
  @Prop()
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, type: Types.ObjectId })
  createdBy: Types.ObjectId;

  @Prop({ required: true, type: GeoData })
  geoLocation: GeoData;

  @Prop({ required: true, enum: postStatusEnum })
  status: postStatusEnum;
}

export type PostsDocument = Posts & Document;

export const PostsSchema = SchemaFactory.createForClass(Posts);

export { postStatusEnum, GeoData };
