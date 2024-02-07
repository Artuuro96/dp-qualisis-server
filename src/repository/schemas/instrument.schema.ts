import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base.schema';

export type InstrumentDocument = HydratedDocument<Instrument>;

@Schema()
export class Instrument extends Base {
  _id?: Types.ObjectId;

  @Prop()
  entryId: string;

  @Prop()
  orderId: string;

  @Prop()
  name: string;

  @Prop()
  type?: string;

  @Prop()
  description?: string;

  /*constructor(Instrument:Partial<Instrument>) {
    super(Instrument)
    Object.assign(this, Instrument)
  }*/
}

export const InstrumentSchema = SchemaFactory.createForClass(Instrument);
