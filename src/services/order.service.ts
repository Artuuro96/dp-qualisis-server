import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repository/repositories/order.repository';
import { Order } from '../repository/schemas/order.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderDTO } from '../dtos/order.dto';
import { isNil } from 'lodash';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
  ) {}

  /**
   * @name create
   * @param {object} order Object order to create
   * @description Creates a order
   * @returns {Object} Returns the order
   */
  async create(order: OrderDTO): Promise<Order> {
    const newOrder: Order = {
      ...order,
      createdBy: '63d8b7c773867f515b7b8adb', //Until we know how to get the UserId
    };

    const orderCreated = await this.orderRepository.create(newOrder);
    return orderCreated;
  }

  /**
   * @name findById
   * @param {string} orderId Id from the order
   * @description Finds a order with his ID
   * @returns {Object} Returns the order found
   */
  async findById(orderId): Promise<Order> {
    const orderFound = await this.orderRepository.findById(orderId);
    if (isNil(orderFound)) throw new NotFoundException('order not found');
    if (orderFound.deleted) throw new NotFoundException('order not found');
    return orderFound;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the order paginated
   * @returns {PaginateResult} Object with the order paginate
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

    const orders = await this.orderRepository.find({ query, options });
    const countorders = await this.orderRepository.count(query);
    return {
      result: orders,
      total: countorders,
      page: skip,
      pages: Math.ceil(countorders / limit) || 0,
    };
  }

  /**
   * @name update
   * @param {Object} order Object order to update
   * @description Update the order
   * @returns {Object} Returns the order updated
   */
  async update(order, orderId): Promise<Order> {
    const orderFound = await this.orderRepository.findById(orderId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(orderFound)) throw new NotFoundException('Order not found');
    if (orderFound.deleted) throw new NotFoundException('Order not found');

    order.Id = orderId;
    const orderUpdated = await this.orderRepository.updateOne(order);
    return orderUpdated;
  }

  /**
   * @name delete
   * @param {string} orderId Id from the order
   * @description Deletes the order but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(orderId): Promise<Order> {
    const order = await this.orderRepository.findById(orderId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(order)) throw new NotFoundException('Order not found');
    if (order.deleted) throw new BadRequestException('Order already deleted');

    order.deleted = true;
    return this.orderRepository.updateOne(order);
  }
}