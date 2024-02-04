import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEquipmentRepository } from '../repository/repositories/orderEquipment.repository';
import { OrderEquipment } from '../repository/schemas/orderEquipment.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderEquipmentDTO } from '../dtos/orderEquipment.dto';
import { isNil } from 'lodash';

@Injectable()
export class OrderEquipmentService {
  constructor(private orderEquipmentRepository: OrderEquipmentRepository) {}

  /**
   * @name create
   * @param {object} orderEquipment Object OrderEquipment to create
   * @description Creates a order
   * @returns {Object} Returns the order
   */
  async create(orderEquipment: OrderEquipmentDTO): Promise<OrderEquipment> {
    const newOrderEquipment: OrderEquipment = {
      ...orderEquipment,
      createdBy: '63d8b7c773867f515b7b8adb', //Until we know how to get the UserId
    };

    const orderEquipmentCreated =
      await this.orderEquipmentRepository.create(newOrderEquipment);
    return orderEquipmentCreated;
  }

  /**
   * @name findById
   * @param {string} orderEquipmentId Id from the orderEquipment
   * @description Finds a orderEquipment with his ID
   * @returns {Object} Returns the orderEquipment found
   */
  async findById(orderEquipmentId): Promise<OrderEquipment> {
    const orderEquipmentFound =
      await this.orderEquipmentRepository.findById(orderEquipmentId);
    if (isNil(orderEquipmentFound))
      throw new NotFoundException('OrderEquipment not found');
    if (orderEquipmentFound.deleted)
      throw new NotFoundException('OrderEquipment not found');
    return orderEquipmentFound;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the OrderEquipment paginated
   * @returns {PaginateResult} Object with the OrderEquipment paginate
   */
  async findAll(
    keyValue = '',
    skip = 0,
    limit?: number,
  ): Promise<PaginateResult> {
    skip = Number(skip);
    limit = Number(limit);
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };

    //need to find the way of doing a variable search
    const query = {
      name: new RegExp(`${keyValue}`, 'i'),
    };

    const orderEquipments = await this.orderEquipmentRepository.find({
      query,
      options,
    });
    const countorderEquipments =
      await this.orderEquipmentRepository.count(query);
    return {
      result: orderEquipments,
      total: countorderEquipments,
      page: skip,
      pages: Math.ceil(countorderEquipments / limit) || 0,
    };
  }

  /**
   * @name update
   * @param {Object} orderEquipment Object orderEquipment to update
   * @description Update the orderEquipment
   * @returns {Object} Returns the orderEquipment updated
   */
  async update(orderEquipment, orderEquipmentId): Promise<OrderEquipment> {
    const orderEquipmentFound = await this.orderEquipmentRepository.findById(
      orderEquipmentId,
      {
        _id: 1,
        deleted: 1,
      },
    );

    if (isNil(orderEquipmentFound))
      throw new NotFoundException('OrderEquipment not found');
    if (orderEquipmentFound.deleted)
      throw new NotFoundException('OrderEquipment not found');

    orderEquipment.Id = orderEquipmentId;
    const orderEquipmentUpdated =
      await this.orderEquipmentRepository.updateOne(orderEquipment);
    return orderEquipmentUpdated;
  }

  /**
   * @name delete
   * @param {string} orderEquipmentId Id from the order
   * @description Deletes the OrderEquipment but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(orderEquipmentId): Promise<OrderEquipment> {
    const orderEquipment = await this.orderEquipmentRepository.findById(
      orderEquipmentId,
      {
        _id: 1,
        deleted: 1,
      },
    );

    if (isNil(orderEquipment))
      throw new NotFoundException('OrderEquipment not found');
    if (orderEquipment.deleted)
      throw new BadRequestException('OrderEquipment already deleted');

    orderEquipment.deleted = true;
    return this.orderEquipmentRepository.updateOne(orderEquipment);
  }
}
