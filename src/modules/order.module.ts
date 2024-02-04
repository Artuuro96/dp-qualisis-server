import { Module } from '@nestjs/common';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtService } from '@nestjs/jwt';
import { ClientModule } from 'src/client/client.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, JwtService],
  imports: [RepositoryModule, ClientModule],
})
export class OrderModule {}
