import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './repositories/order.repository';

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
    ]),
  ],
  exports: [OrderRepository],
  providers: [OrderRepository],
})
export class RepositoryModule {}
