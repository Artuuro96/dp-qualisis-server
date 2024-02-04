import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base.schema';

export type OrderEquipmentDocument = HydratedDocument<OrderEquipment>;

@Schema()
export class OrderEquipment extends Base {
  _id?: Types.ObjectId;

  @Prop()
  instrumentId: string;

  @Prop()
  orderId: string;

  /*constructor(OrderEquipment:Partial<OrderEquipment>) {
    super(OrderEquipment)
    Object.assign(this, OrderEquipment)
  }*/
}

export const OrderEquipmentSchema =
  SchemaFactory.createForClass(OrderEquipment);
