import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.orderModel.create(order);
  }

  async findById(orderId: string): Promise<Order> {
    const result = await this.orderModel.findById(orderId);
    if (!result) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }
}
