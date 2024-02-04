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
import { OrderEquipment } from '../repository/schemas/orderEquipment.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderEquipmentDTO } from '../dtos/orderEquipment.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { OrderEquipmentService } from '../services/orderEquipment.service';

@Controller('orderEquipments')
export class OrderEquipmentController {
  constructor(private readonly orderEquipmentService: OrderEquipmentService) {}

  @Post()
  async create(
    @Body() orderEquipment: OrderEquipmentDTO,
  ): Promise<OrderEquipment> {
    return this.orderEquipmentService.create(orderEquipment);
  }

  @Get('/:orderEquipmentId')
  async findById(
    @Param('orderEquipmentId') orderEquipmentId: string,
  ): Promise<OrderEquipment> {
    return this.orderEquipmentService.findById(orderEquipmentId);
  }

  @Get()
  async findAll(
    @Query() { skip, limit, keyValue }: PaginationParamsDTO,
  ): Promise<PaginateResult> {
    return this.orderEquipmentService.findAll(keyValue, skip, limit);
  }

  @Patch('/:orderEquipmentId')
  async update(
    @Body() orderEquipment: Partial<OrderEquipment>,
    @Param('orderEquipmentId') orderEquipmentId: string,
  ): Promise<OrderEquipment> {
    return this.orderEquipmentService.update(orderEquipment, orderEquipmentId);
  }

  @Delete('/:orderEquipmentId')
  async delete(
    @Param('orderEquipmentId') orderEquipmentId: string,
  ): Promise<OrderEquipment> {
    return this.orderEquipmentService.delete(orderEquipmentId);
  }
}
