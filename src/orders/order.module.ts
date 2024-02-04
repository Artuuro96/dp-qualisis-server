import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { AcmaClient } from 'src/client/acma.client';
import { ConfigService } from 'src/config/config.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [OrderController],
  providers: [OrderService, AcmaClient, ConfigService, JwtService],
  imports: [RepositoryModule],
})
export class OrderModule {}
