import { Module } from '@nestjs/common';
import { OrderModule } from './modules/order.module';
import { OrderEquipmentModule } from './modules/orderEquipment.module';
import { InstrumentModule } from './modules/instrument.module';

@Module({
  imports: [OrderModule, InstrumentModule, OrderEquipmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
