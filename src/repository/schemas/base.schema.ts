import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BaseDocument = HydratedDocument<Base>;

@Schema()
export class Base {
  @Prop({ default: false })
  deleted?: boolean;

  @Prop({ default: new Date() })
  createdAt?: Date;

  @Prop()
  createdBy: string;

  @Prop({ default: new Date() })
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;

  @Prop()
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;

  /*constructor(base:Partial<Base>) {
        Object.assign(this, base)
    }*/
}
