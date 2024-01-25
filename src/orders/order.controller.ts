import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/repository/schemas/order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Post()
  async create(@Body() order: Order): Promise<Order> {
    return await this.orderService.create(order);
  }
}
