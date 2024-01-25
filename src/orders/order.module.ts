import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [RepositoryModule],
})
export class OrderModule {}
