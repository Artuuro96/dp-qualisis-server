import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './repositories/order.repository';

import {
  OrderEquipment,
  OrderEquipmentSchema,
} from './schemas/orderEquipment.schema';
import { OrderEquipmentRepository } from './repositories/orderEquipment.repository';

import { Instrument, InstrumentSchema } from './schemas/instrument.schema';
import { InstrumentRepository } from './repositories/instrument.repository';

const config = new ConfigService();

@Module({
  imports: [
    MongooseModule.forRoot(config.get('MONGODB_URI'), {
      dbName: config.get('MONGODB_NAME'),
    }),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: OrderEquipment.name,
        schema: OrderEquipmentSchema,
      },
      {
        name: Instrument.name,
        schema: InstrumentSchema,
      },
    ]),
  ],
  exports: [OrderRepository, OrderEquipmentRepository, InstrumentRepository],
  providers: [OrderRepository, OrderEquipmentRepository, InstrumentRepository],
})
export class RepositoryModule {}
