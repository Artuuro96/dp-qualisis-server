import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Order } from '../repository/schemas/order.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderDTO } from '../dtos/order.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/assign-order')
  async assignOrder(
    @Body() { instrumentsIds, orderId },
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Order> {
    return this.orderService.assignOrder(instrumentsIds, orderId, executionCtx);
  }

  @Post()
  async create(@Body() order: OrderDTO, @ExecutionCtx() executionCtx: Context): Promise<Order> {
    return this.orderService.create(order, executionCtx);
  }

  @Get('/by-dates')
  async findByDates(
    @Query() { skip, limit, startDate, endDate }: PaginationParamsDTO,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<PaginateResult> {
    return this.orderService.findByDates(executionCtx, skip, limit, startDate, endDate);
  }

  @Get('/:orderId')
  async findById(@Param('orderId') orderId: string, @ExecutionCtx() executionCtx: Context): Promise<Order> {
    return this.orderService.findById(orderId, executionCtx);
  }

  @Get()
  async findAll(
    @Query() { skip, limit, keyValue }: PaginationParamsDTO,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<PaginateResult> {
    return this.orderService.findAll(keyValue, skip, limit, executionCtx);
  }

  @Patch('/:orderId')
  async update(
    @Body() order: Partial<Order>,
    @Param('orderId') orderId: string,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Order> {
    return this.orderService.update(order, orderId, executionCtx);
  }

  @Delete('/:orderId')
  async delete(@Param('orderId') orderId: string, @ExecutionCtx() executionCtx: Context): Promise<Order> {
    return this.orderService.delete(orderId, executionCtx);
  }
}
