import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repository/repositories/order.repository';
import { Order } from '../repository/schemas/order.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderDTO } from '../dtos/order.dto';
import { isNil, isNaN } from 'lodash';
import { Context } from 'src/auth/context/execution-ctx';
import { AcmaClient } from 'src/client/acma.client';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private acmaClient: AcmaClient,
  ) {}

  /**
   * @name create
   * @param {object} order Object order to create
   * @description Creates a order
   * @returns {Object} Returns the order
   */
  async create(order: OrderDTO, executionCtx: Context): Promise<Order> {
    const { startDate, endDate } = order;
    let newStartDate: Date;
    let newEndDate: Date;

    if (isNil(startDate)) newStartDate = new Date();
    if (isNil(endDate)) {
      newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + 1);
    }

    const newOrder: Order = {
      ...order,
      createdBy: executionCtx.userId,
      startDate: newEndDate,
      endDate: newStartDate,
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
  async findAll(keyValue = '', skip = 0, limit = 10): Promise<PaginateResult> {
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
      perPage: limit,
    };
  }

  /**
   * @name findByDates
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the order paginated
   * @returns {PaginateResult} Object with the order paginate
   */
  async findByDates(
    executionCtx: Context,
    skip = 0,
    limit = 10,
    startDate?: string,
    endDate?: string,
  ): Promise<PaginateResult> {
    skip = Number(skip);
    limit = Number(limit);
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };
    if (isNil(startDate) || isNil(endDate)) throw new NotFoundException('startDate and endDate is required');

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime()))
      throw new NotFoundException('startDate and endDate a valid date is required');

    const query = {
      startDate: { $gte: newStartDate },
      endDate: { $lt: newEndDate },
    };

    const orders = await this.orderRepository.find({ query, options });
    const countorders = await this.orderRepository.count(query);
    const usersIds = [];
    orders.forEach((order) => {
      usersIds.push(order.workerId);
      usersIds.push(order.vendorId);
    });

    const uniqIds = [...new Set(usersIds)];

    const usersData = await this.acmaClient.getUserInfo(uniqIds, executionCtx.token);

    const newOrders = orders.map((order) => {
      const worker = usersData.find((element) => element.id === order.workerId);
      const vendor = usersData.find((element) => element.id === order.vendorId);
      const newOrder = {
        _id: order._id,
        createdAt: order.createdAt,
        createdBy: order.createdBy,
        updatedAt: order.updatedAt,
        workerId: order.workerId,
        vendorId: order.vendorId,
        name: order.name,
        status: order.status,
        description: order.description,
        endDate: order.endDate,
        startDate: order.startDate,
        worker: {
          id: worker.id,
          name: worker.name,
          lastName: worker.lastName,
          secondLastName: worker.secondLastName,
          username: worker.username,
          email: worker.email,
          activeRole: worker.activeRole,
        },
        vendor: {
          id: vendor.id,
          name: vendor.name,
          lastName: vendor.lastName,
          secondLastName: vendor.secondLastName,
          username: vendor.username,
          email: vendor.email,
          activeRole: vendor.activeRole,
        },
      };
      return newOrder;
    });

    return {
      result: newOrders,
      total: countorders,
      page: skip,
      pages: Math.ceil(countorders / limit) || 0,
      perPage: limit,
    };
  }

  /**
   * @name update
   * @param {Object} order Object order to update
   * @description Update the order
   * @returns {Object} Returns the order updated
   */
  async update(order, orderId, executionCtx: Context): Promise<Order> {
    const orderFound = await this.orderRepository.findById(orderId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(orderFound)) throw new NotFoundException('Order not found');
    if (orderFound.deleted) throw new NotFoundException('Order not found');

    order.Id = orderId;
    order.updatedBy = executionCtx.userId;
    const orderUpdated = await this.orderRepository.updateOne(order);
    return orderUpdated;
  }

  /**
   * @name delete
   * @param {string} orderId Id from the order
   * @description Deletes the order but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(orderId, executionCtx: Context): Promise<Order> {
    const order = await this.orderRepository.findById(orderId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(order)) throw new NotFoundException('Order not found');
    if (order.deleted) throw new BadRequestException('Order already deleted');

    order.deleted = true;
    order.deletedBy = executionCtx.userId;
    return this.orderRepository.updateOne(order);
  }
}
