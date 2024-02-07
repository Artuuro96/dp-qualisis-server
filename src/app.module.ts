import { Module } from '@nestjs/common';
import { OrderModule } from './orders/order.module';
import { EntryModule } from './entries/entry.module';
import { InstrumentModule } from './instruments/instrument.module';

@Module({
  imports: [OrderModule, InstrumentModule, EntryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
