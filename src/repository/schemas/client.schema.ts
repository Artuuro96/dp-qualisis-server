import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client extends Base {
  _id?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  /*constructor(Client:Partial<Client>) {
    super(Client)
    Object.assign(this, Client)
  }*/
}

export const ClientSchema = SchemaFactory.createForClass(Client);
