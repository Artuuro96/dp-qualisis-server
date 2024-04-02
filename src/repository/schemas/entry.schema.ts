import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base.schema';

export type EntryDocument = HydratedDocument<Entry>;

@Schema()
export class Entry extends Base {
  _id?: Types.ObjectId;

  @Prop()
  orderNumber?: string;

  @Prop()
  clientId: string;

  @Prop()
  description?: string;

  /*constructor(Entry:Partial<Entry>) {
    super(Entry)
    Object.assign(this, Entry)
  }*/
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
