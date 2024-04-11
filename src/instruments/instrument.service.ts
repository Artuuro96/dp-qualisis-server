import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InstrumentRepository } from '../repository/repositories/instrument.repository';
import { EntryRepository } from '../repository/repositories/entry.repository';
import { OrderRepository } from '../repository/repositories/order.repository';
import { Instrument } from '../repository/schemas/instrument.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { isNil } from 'lodash';
import { Context } from 'src/auth/context/execution-ctx';
import { Entry } from 'src/repository/schemas/entry.schema';
import { Order } from 'src/repository/schemas/order.schema';

@Injectable()
export class InstrumentService {
  constructor(
    private instrumentRepository: InstrumentRepository,
    private entryRepository: EntryRepository,
    private orderRepository: OrderRepository,
  ) {}

  /**
   * @name create
   * @param {object} instrument Object instrument to create
   * @description Creates a instrument
   * @returns {Object} Returns the instrument
   */
  async create(instrument: InstrumentDTO, executionCtx: Context): Promise<Instrument> {
    const newInstrument: Instrument = {
      ...instrument,
      createdBy: executionCtx.userId,
    };

    const instrumentCreated = await this.instrumentRepository.create(newInstrument);
    return instrumentCreated;
  }

  /**
   * @name findById
   * @param {string} instrumentId Id from the instrument
   * @description Finds a instrument with his ID
   * @returns {Object} Returns the instrument found
   */
  async findById(
    instrumentId,
  ): Promise<{ instrument: Instrument; entry: Entry | null; order: Order | null }> {
    const instrumentFound = await this.instrumentRepository.findById(instrumentId);

    if (isNil(instrumentFound)) throw new NotFoundException('instrument not found');
    if (instrumentFound.deleted) throw new NotFoundException('instrument not found');

    const promiseFound = [];
    if (!isNil(instrumentFound.entryId))
      promiseFound.push(this.entryRepository.findById(instrumentFound.entryId));

    if (!isNil(instrumentFound.orderId))
      promiseFound.push(this.orderRepository.findById(instrumentFound.orderId));

    const [entryFound, orderFound] = await Promise.all(promiseFound);

    return {
      instrument: instrumentFound,
      entry: entryFound,
      order: orderFound,
    };
  }

  async findByEntryId(entryId, skip = 0, limit = 10): Promise<PaginateResult> {
    console.log(entryId);
    skip = Number(skip);
    limit = Number(limit);
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };

    const query = {
      entryId,
      deleted: false,
    };

    const instrumentsFound = await this.instrumentRepository.find({ query, options });
    const countInstrumentFound = await this.instrumentRepository.count({ query });

    const promiseEntries = [];
    const promiseOrders = [];

    instrumentsFound.forEach((instrument) => {
      if (!isNil(instrument.entryId)) promiseEntries.push(this.entryRepository.findById(instrument.entryId));

      if (!isNil(instrument.orderId)) promiseOrders.push(this.entryRepository.findById(instrument.entryId));
    });

    const entriesFound = await Promise.all(promiseEntries);
    const ordersFound = await Promise.all(promiseOrders);
    const newInstruments = instrumentsFound.map((instrument) => {
      const entryFound = entriesFound.find((entry) => entry.id === instrument.entryId);
      const orderFound = ordersFound.find((order) => order.id === instrument.orderId);
      console.log(orderFound, instrument.orderId);
      return {
        _id: instrument._id,
        createdAt: instrument.createdAt,
        createdBy: instrument.createdBy,
        updatedAt: instrument.updatedAt,
        entryId: instrument.entryId,
        name: instrument.name,
        type: instrument.type,
        description: instrument.description,
        orderId: instrument.orderId,
        updatedBy: instrument.updatedBy,
        order: orderFound,
        entry: entryFound,
      };
    });

    return {
      result: newInstruments,
      total: countInstrumentFound,
      page: skip,
      pages: Math.ceil(countInstrumentFound / limit) || 0,
      perPage: limit,
    };
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the instrument paginated
   * @returns {PaginateResult} Object with the instrument paginate
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

    const instruments = await this.instrumentRepository.find({
      query,
      options,
    });
    const countInstruments = await this.instrumentRepository.count(query);
    return {
      result: instruments,
      total: countInstruments,
      page: skip,
      pages: Math.ceil(countInstruments / limit) || 0,
      perPage: limit,
    };
  }

  /**
   * @name update
   * @param {Object} instrument Object instrument to update
   * @description Update the instrument
   * @returns {Object} Returns the instrument updated
   */
  async update(instrument, instrumentId, executionCtx: Context): Promise<Instrument> {
    const instrumentFound = await this.instrumentRepository.findById(instrumentId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(instrumentFound)) throw new NotFoundException('Instrument not found');
    if (instrumentFound.deleted) throw new NotFoundException('Instrument not found');

    instrument.Id = instrumentId;
    instrument.updatedBy = executionCtx.userId;
    const instrumentUpdated = await this.instrumentRepository.updateOne(instrument);
    return instrumentUpdated;
  }

  /**
   * @name delete
   * @param {string} instrumentId Id from the instrument
   * @description Deletes the instrument but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(instrumentId, executionCtx: Context): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findById(instrumentId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(instrument)) throw new NotFoundException('Instrument not found');
    if (instrument.deleted) throw new BadRequestException('Instrument already deleted');

    instrument.deleted = true;
    instrument.deletedBy = executionCtx.userId;
    return this.instrumentRepository.updateOne(instrument);
  }
}
