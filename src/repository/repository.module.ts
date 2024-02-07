import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './repositories/order.repository';

import { Entry, EntrySchema } from './schemas/entry.schema';
import { EntryRepository } from './repositories/entry.repository';

import { Instrument, InstrumentSchema } from './schemas/instrument.schema';
import { InstrumentRepository } from './repositories/instrument.repository';

import { Client, ClientSchema } from './schemas/client.schema';
import { ClientRepository } from './repositories/client.repository';

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
        name: Entry.name,
        schema: EntrySchema,
      },
      {
        name: Instrument.name,
        schema: InstrumentSchema,
      },
      {
        name: Client.name,
        schema: ClientSchema,
      },
    ]),
  ],
  exports: [OrderRepository, EntryRepository, InstrumentRepository, ClientRepository],
  providers: [OrderRepository, EntryRepository, InstrumentRepository, ClientRepository],
})
export class RepositoryModule {}
