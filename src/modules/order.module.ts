import { Module } from '@nestjs/common';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [RepositoryModule],
})
export class OrderModule {}
