import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/repository/repositories/order.repository';
import { Order } from 'src/repository/schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async findById(id: string): Promise<Order> {
    return await this.orderRepository.findById(id);
  }

  async create(order: Order): Promise<Order> {
    return await this.orderRepository.create(order);
  }
}
