import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { OrderEquipment, OrderEquipmentDocument } from '../schemas/orderEquipment.schema';

export class OrderEquipmentRepository {
  constructor(
    @InjectModel(OrderEquipment.name) private orderEquipmentModel: Model<OrderEquipmentDocument>,
  ) {}
  async create(orderEquipment: OrderEquipment): Promise<OrderEquipment> {
    return this.orderEquipmentModel.create(orderEquipment);
  }

  async find(findOptiopns): Promise<OrderEquipment[]> {
    const { query, projection, options } = findOptiopns;
    const orderEquipmentFind = this.orderEquipmentModel.find(query);
    if (!isNil(projection)) orderEquipmentFind.projection(projection);
    if (isNil(options)) return orderEquipmentFind;

    const { limit, skip } = options;
    if (!isNil(limit)) orderEquipmentFind.limit(limit);
    if (!isNil(skip)) orderEquipmentFind.skip(skip);

    return orderEquipmentFind;
  }

  async count(query): Promise<number> {
    return this.orderEquipmentModel.countDocuments(query)
  }

  async findById(orderEquipmentId, projection?): Promise<OrderEquipment> {
    return this.orderEquipmentModel.findById(orderEquipmentId, projection);
  }

  async updateOne(orderEquipment): Promise<OrderEquipment> {
    return this.orderEquipmentModel.findOneAndUpdate({ _id: orderEquipment._id }, orderEquipment, {
      new: true,
    });
  }
}
