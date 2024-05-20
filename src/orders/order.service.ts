import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repository/repositories/order.repository';
import { InstrumentRepository } from '../repository/repositories/instrument.repository';
import { Order } from '../repository/schemas/order.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { OrderDTO } from '../dtos/order.dto';
import { isNil, isNaN } from 'lodash';
import { Context } from 'src/auth/context/execution-ctx';
import { AcmaClient } from 'src/client/acma.client';
import { Instrument } from 'src/repository/schemas/instrument.schema';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private instrumentRepository: InstrumentRepository,
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
    const updateInstruments = !isNil(order.instrumentsIds) && order.instrumentsIds.length > 0;

    if (updateInstruments) {
      const instrumentsFound = order.instrumentsIds.map((id) => this.instrumentRepository.findById(id));
      const testid = await Promise.all(instrumentsFound).catch(() => {
        throw new BadRequestException('Invalid instrument Id');
      });
      if (testid.includes(null)) throw new NotFoundException('Not existing instrument id');
    }

    if (isNil(startDate)) newStartDate = new Date();
    else {
      newStartDate = new Date(startDate);
    }
    if (isNil(endDate)) {
      newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + 1);
    } else {
      newEndDate = new Date(endDate);
    }

    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime()))
      throw new NotFoundException('startDate and endDate a valid date is required');

    const newOrder: Order = {
      ...order,
      createdBy: executionCtx.userId,
      startDate: newEndDate,
      endDate: newStartDate,
    };

    const orderCreated = await this.orderRepository.create(newOrder);
    if (updateInstruments) {
      await this.assignOrderToInstruments(order.instrumentsIds, orderCreated._id.toString(), executionCtx);
    }
    return orderCreated;
  }

  /**
   *
   * @param {string[]} instrumentsIds Ids for the instruments to update
   * @param {string} orderId Order that will be updated
   * @param {object} executionCtx User Context
   * @returns {Object} Returns the order
   */
  async assignOrder(instrumentsIds: string[], orderId: string, executionCtx: Context) {
    const orderFound = await this.orderRepository.findById(orderId, {
      _id: 1,
      deleted: 1,
    });
    const updateInstruments = !isNil(instrumentsIds) && instrumentsIds.length > 0;

    if (isNil(orderFound)) throw new NotFoundException('Order not found');
    if (orderFound.deleted) throw new NotFoundException('Order not found');

    if (updateInstruments) {
      const instrumentsFound = instrumentsIds.map((id) => this.instrumentRepository.findById(id));
      const testid = await Promise.all(instrumentsFound).catch(() => {
        throw new BadRequestException('Invalid instrument Id');
      });
      if (testid.includes(null)) throw new NotFoundException('Not existing instrument id');
    }

    if (!isNil(instrumentsIds) && instrumentsIds.length > 0) {
      await this.assignOrderToInstruments(instrumentsIds, orderFound._id.toString(), executionCtx);
    }
    return orderFound;
  }

  async assignOrderToInstruments(instrumentsId: string[], orderId: string, executionCtx: Context) {
    return await this.instrumentRepository.updateManyById(instrumentsId, {
      orderId,
      updatedBy: executionCtx.userId,
    });
  }

  /**
   * @name findById
   * @param {string} orderId Id from the order
   * @description Finds a order with his ID
   * @returns {Object} Returns the order found
   */
  async findById(orderId, executionCtx): Promise<Order> {
    const orderFound = await this.orderRepository.findById(orderId);
    if (isNil(orderFound)) throw new NotFoundException('order not found');
    if (orderFound.deleted) throw new NotFoundException('order not found');
    const uniqIds = [...new Set([orderFound.vendorId, orderFound.workerId])];
    const usersData = await this.acmaClient.getUserInfo(uniqIds, executionCtx.token);

    const worker = usersData.find((element) => element.id === orderFound.workerId);
    const vendor = usersData.find((element) => element.id === orderFound.vendorId);

    const query = {
      orderId: orderFound._id,
    };
    const instruments = await this.instrumentRepository.find({ query });

    const orderFormated = {
      _id: orderFound._id,
      createdAt: orderFound.createdAt,
      createdBy: orderFound.createdBy,
      updatedAt: orderFound.updatedAt,
      workerId: orderFound.workerId,
      vendorId: orderFound.vendorId,
      name: orderFound.name,
      status: orderFound.status,
      description: orderFound.description,
      endDate: orderFound.endDate,
      startDate: orderFound.startDate,
      worker: {
        id: worker?.id,
        name: worker?.name,
        lastName: worker?.lastName,
        secondLastName: worker?.secondLastName,
        username: worker?.username,
        email: worker?.email,
        activeRole: worker?.activeRole,
      },
      vendor: {
        id: vendor?.id,
        name: vendor?.name,
        lastName: vendor?.lastName,
        secondLastName: vendor?.secondLastName,
        username: vendor?.username,
        email: vendor?.email,
        activeRole: vendor?.activeRole,
      },
      instruments,
    };

    return orderFormated;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the order paginated
   * @returns {PaginateResult} Object with the order paginate
   */
  async findAll(keyValue = '', skip = 0, limit = 10, executionCtx): Promise<PaginateResult> {
    skip = Number(skip);
    limit = Number(limit);
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };

    //need to find the way of doing a variable search
    const query = {
      name: new RegExp(`${keyValue}`, 'i'),
      deleted: false,
    };

    const orders = await this.orderRepository.find({ query, options });
    const countorders = await this.orderRepository.count(query);
    const usersIds = [];
    const instrumentsPromise = [];

    orders.forEach((order) => {
      const query = {
        orderId: order._id,
      };

      instrumentsPromise.push(this.instrumentRepository.find({ query }));

      usersIds.push(order.workerId);
      usersIds.push(order.vendorId);
      usersIds.push(order.createdBy);
    });

    const uniqIds = [...new Set(usersIds)];
    const usersData = await this.acmaClient.getUserInfo(uniqIds, executionCtx.token);

    const intrumentsFound = await Promise.all(instrumentsPromise);
    const flattedInstruments = intrumentsFound.flat();

    const newOrders = orders.map((order) => {
      const worker = usersData.find((user) => user.id === order.workerId);
      const vendor = usersData.find((user) => user.id === order.vendorId);
      const creator = usersData.find((user) => user.id === order.createdBy);

      const instruments = flattedInstruments
        .filter((inst: Instrument) => inst.orderId === order._id.toString())
        .map((instFound: Instrument) => {
          return {
            id: instFound?._id,
            entryId: instFound?.entryId,
            name: instFound?.name,
            type: instFound?.type,
            description: instFound?.description,
          };
        });

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
          id: worker?.id,
          name: worker?.name,
          lastName: worker?.lastName,
          secondLastName: worker?.secondLastName,
          username: worker?.username,
          email: worker?.email,
          activeRole: worker?.activeRole,
        },
        vendor: {
          id: vendor?.id,
          name: vendor?.name,
          lastName: vendor?.lastName,
          secondLastName: vendor?.secondLastName,
          username: vendor?.username,
          email: vendor?.email,
          activeRole: vendor?.activeRole,
        },
        creator: {
          id: creator?.id,
          name: creator?.name,
          lastName: creator?.lastName,
          secondLastName: creator?.secondLastName,
          username: creator?.username,
          email: creator?.email,
          activeRole: creator?.activeRole,
        },
        instruments,
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
      deleted: false,
    };

    const orders = await this.orderRepository.find({ query, options });
    const countorders = await this.orderRepository.count(query);
    const usersIds = [];
    const instrumentsPromise = [];
    orders.forEach((order) => {
      usersIds.push(order.workerId);
      usersIds.push(order.vendorId);
    });

    orders.forEach((order) => {
      const query = {
        orderId: order._id,
      };

      instrumentsPromise.push(this.instrumentRepository.find({ query }));

      usersIds.push(order.workerId);
      usersIds.push(order.vendorId);
    });

    const uniqIds = [...new Set(usersIds)];
    const usersData = await this.acmaClient.getUserInfo(uniqIds, executionCtx.token);

    const intrumentsFound = await Promise.all(instrumentsPromise);
    const flattedInstruments = intrumentsFound.flat();

    const newOrders = orders.map((order) => {
      const worker = usersData.find((user) => user.id === order.workerId);
      const vendor = usersData.find((user) => user.id === order.vendorId);

      const instruments = flattedInstruments
        .filter((inst: Instrument) => inst.orderId === order._id.toString())
        .map((instFound: Instrument) => {
          return {
            id: instFound?._id,
            entryId: instFound?.entryId,
            name: instFound?.name,
            type: instFound?.type,
            description: instFound?.description,
          };
        });

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
          id: worker?.id,
          name: worker?.name,
          lastName: worker?.lastName,
          secondLastName: worker?.secondLastName,
          username: worker?.username,
          email: worker?.email,
          activeRole: worker?.activeRole,
        },
        vendor: {
          id: vendor?.id,
          name: vendor?.name,
          lastName: vendor?.lastName,
          secondLastName: vendor?.secondLastName,
          username: vendor?.username,
          email: vendor?.email,
          activeRole: vendor?.activeRole,
        },
        instruments,
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
