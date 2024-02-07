import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order extends Base {
  _id?: Types.ObjectId;

  @Prop()
  workerId: string;

  @Prop()
  vendorId: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  description?: string;

  /*constructor(Order:Partial<Order>) {
    super(Order)
    Object.assign(this, Order)
  }*/
}

export const OrderSchema = SchemaFactory.createForClass(Order);
