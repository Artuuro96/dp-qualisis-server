import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from './base.schema';
import { Types, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order extends Base {
  _id?: Types.ObjectId;

  @Prop()
  number: string;

  @Prop()
  status: StatusEnum;

  constructor(order: Partial<Order> = {}) {
    super();
    Object.assign(this, order);
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);
