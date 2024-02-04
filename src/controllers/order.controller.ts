

import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Order } from '../repository/schemas/order.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderDTO } from '../dtos/order.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { OrderService } from '../services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly OrderService: OrderService) {}

  @Post()
  async create(@Body() order: OrderDTO): Promise<Order> {
    return this.OrderService.create(order);
  }

  @Get('/:orderId')
  async findById(@Param('orderId') orderId: string): Promise<Order> {
    return this.OrderService.findById(orderId);
  }

  @Get()
  async findAll(
    @Query() { skip, limit, keyValue }: PaginationParamsDTO,
  ): Promise<PaginateResult> {
    return this.OrderService.findAll(keyValue, skip, limit);
  }

  @Patch('/:orderId')
  async update(
    @Body() order: Partial<Order>,
    @Param('orderId') orderId: string,
  ): Promise<Order> {
    return this.OrderService.update(order, orderId);
  }

  @Delete('/:orderId')
  async delete(@Param('orderId') orderId: string): Promise<Order> {
    return this.OrderService.delete(orderId);
  }
}
