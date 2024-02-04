import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/repository/schemas/order.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/:id')
  async findById(
    @Param('id') id: string,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Order> {
    console.log(executionCtx);
    return this.orderService.findById(id);
  }

  @Post()
  async create(
    @Body() order: Order,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Order> {
    console.log(executionCtx);
    return await this.orderService.create(order);
  }
}
