import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InstrumentRepository } from '../repository/repositories/instrument.repository';
import { Instrument } from '../repository/schemas/instrument.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { isNil } from 'lodash';

@Injectable()
export class InstrumentService {
  constructor(private instrumentRepository: InstrumentRepository) {}

  /**
   * @name create
   * @param {object} instrument Object instrument to create
   * @description Creates a instrument
   * @returns {Object} Returns the instrument
   */
  async create(instrument: InstrumentDTO): Promise<Instrument> {
    const newInstrument: Instrument = {
      ...instrument,
      createdBy: '63d8b7c773867f515b7b8adb', //Until we know how to get the UserId
    };

    const instrumentCreated =
      await this.instrumentRepository.create(newInstrument);
    return instrumentCreated;
  }

  /**
   * @name findById
   * @param {string} instrumentId Id from the instrument
   * @description Finds a instrument with his ID
   * @returns {Object} Returns the instrument found
   */
  async findById(instrumentId): Promise<Instrument> {
    const instrumentFound =
      await this.instrumentRepository.findById(instrumentId);
    if (isNil(instrumentFound))
      throw new NotFoundException('instrument not found');
    if (instrumentFound.deleted)
      throw new NotFoundException('instrument not found');
    return instrumentFound;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the instrument paginated
   * @returns {PaginateResult} Object with the instrument paginate
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

    const instruments = await this.instrumentRepository.find({
      query,
      options,
    });
    const countinstruments = await this.instrumentRepository.count(query);
    return {
      result: instruments,
      total: countinstruments,
      page: skip,
      pages: Math.ceil(countinstruments / limit) || 0,
    };
  }

  /**
   * @name update
   * @param {Object} instrument Object instrument to update
   * @description Update the instrument
   * @returns {Object} Returns the instrument updated
   */
  async update(instrument, instrumentId): Promise<Instrument> {
    const instrumentFound = await this.instrumentRepository.findById(
      instrumentId,
      {
        _id: 1,
        deleted: 1,
      },
    );

    if (isNil(instrumentFound))
      throw new NotFoundException('Instrument not found');
    if (instrumentFound.deleted)
      throw new NotFoundException('Instrument not found');

    instrument.Id = instrumentId;
    const instrumentUpdated =
      await this.instrumentRepository.updateOne(instrument);
    return instrumentUpdated;
  }

  /**
   * @name delete
   * @param {string} instrumentId Id from the instrument
   * @description Deletes the instrument but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(instrumentId): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findById(instrumentId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(instrument)) throw new NotFoundException('Instrument not found');
    if (instrument.deleted)
      throw new BadRequestException('Instrument already deleted');

    instrument.deleted = true;
    return this.instrumentRepository.updateOne(instrument);
  }
}
