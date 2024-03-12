import { Module } from '@nestjs/common';
import { OrderModule } from './orders/order.module';
import { EntryModule } from './entries/entry.module';
import { InstrumentModule } from './instruments/instrument.module';
import { ClientModule } from './clients/client.module';

import { UtilModule } from './utils/utils.module';

@Module({
  imports: [ClientModule, OrderModule, InstrumentModule, EntryModule, UtilModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
