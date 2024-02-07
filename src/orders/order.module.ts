import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtService } from '@nestjs/jwt';
import { AcmaClientModule } from 'src/client/client.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, JwtService],
  imports: [RepositoryModule, AcmaClientModule],
})
export class OrderModule {}
