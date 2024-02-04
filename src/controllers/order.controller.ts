import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Order } from '../repository/schemas/order.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderDTO } from '../dtos/order.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { OrderService } from '../services/order.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() order: OrderDTO, @ExecutionCtx() executionCtx: Context): Promise<Order> {
    return this.orderService.create(order, executionCtx);
  }

  @Get('/:orderId')
  async findById(@Param('orderId') orderId: string): Promise<Order> {
    return this.orderService.findById(orderId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.orderService.findAll(keyValue, skip, limit);
  }

  @Patch('/:orderId')
  async update(@Body() order: Partial<Order>, @Param('orderId') orderId: string): Promise<Order> {
    return this.orderService.update(order, orderId);
  }

  @Delete('/:orderId')
  async delete(@Param('orderId') orderId: string): Promise<Order> {
    return this.orderService.delete(orderId);
  }
}
