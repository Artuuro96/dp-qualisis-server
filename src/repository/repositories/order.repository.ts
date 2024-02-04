import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Order, OrderDocument } from '../schemas/order.schema';

export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}
  async create(order: Order): Promise<Order> {
    return this.orderModel.create(order);
  }

  async find(findOptiopns): Promise<Order[]> {
    const { query, projection, options } = findOptiopns;
    const orderFind = this.orderModel.find(query);
    if (!isNil(projection)) orderFind.projection(projection);
    if (isNil(options)) return orderFind;

    const { limit, skip } = options;
    if (!isNil(limit)) orderFind.limit(limit);
    if (!isNil(skip)) orderFind.skip(skip);

    return orderFind;
  }

  async count(query): Promise<number> {
    return this.orderModel.countDocuments(query);
  }

  async findById(orderId, projection?): Promise<Order> {
    return this.orderModel.findById(orderId, projection);
  }

  async updateOne(order): Promise<Order> {
    return this.orderModel.findOneAndUpdate({ _id: order._id }, order, {
      new: true,
    });
  }
}
