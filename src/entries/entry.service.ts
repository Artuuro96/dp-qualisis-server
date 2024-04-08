import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntryRepository } from '../repository/repositories/entry.repository';
import { ClientRepository } from '../repository/repositories/client.repository';
import { Entry } from '../repository/schemas/entry.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { EntryDTO } from '../dtos/entry.dto';
import { isNil } from 'lodash';
import { Context } from 'src/auth/context/execution-ctx';
import { Client } from 'src/repository/schemas/client.schema';

@Injectable()
export class EntryService {
  constructor(
    private entryRepository: EntryRepository,
    private clientRepository: ClientRepository,
  ) {}

  /**
   * @name create
   * @param {object} entry Object Entry to create
   * @description Creates a order
   * @returns {Object} Returns the order
   */
  async create(entry: EntryDTO, executionCtx: Context): Promise<Entry> {
    const newEntry: Entry = {
      ...entry,
      createdBy: executionCtx.userId,
    };

    const entryCreated = await this.entryRepository.create(newEntry);
    return entryCreated;
  }

  /**
   * @name findById
   * @param {string} entryId Id from the entry
   * @description Finds a entry with his ID
   * @returns {Object} Returns the entry found
   */
  async findById(entryId): Promise<{ entry: Entry; client: Client | null }> {
    const entryFound = await this.entryRepository.findById(entryId);
    if (isNil(entryFound)) throw new NotFoundException('Entry not found');
    if (entryFound.deleted) throw new NotFoundException('Entry not found');

    let clientFound: Client;
    if (!isNil(entryFound.clientId)) clientFound = await this.clientRepository.findById(entryFound.clientId);

    return {
      entry: entryFound,
      client: clientFound,
    };
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the Entry paginated
   * @returns {PaginateResult} Object with the Entry paginate
   */
  async findAll(keyValue = '', skip = 0, limit = 10): Promise<PaginateResult> {
    skip = Number(skip);
    limit = Number(limit);

    const findAggregate = [
      {
        $addFields: {
          clientId: { $toObjectId: '$clientId' },
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $match: {
          $or: [
            { entryNumber: { $regex: new RegExp(`${keyValue}`, 'i') } },
            { 'client.name': { $regex: new RegExp(`${keyValue}`, 'i') } },
          ],
        },
      },
      {
        $addFields: {
          client: { $arrayElemAt: ['$client', 0] },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    const countAggregate = [
      {
        $addFields: {
          clientId: { $toObjectId: '$clientId' },
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $match: {
          $or: [
            { entryNumber: { $regex: new RegExp(`${keyValue}`, 'i') } },
            { 'client.name': { $regex: new RegExp(`${keyValue}`, 'i') } },
          ],
        },
      },
      {
        $addFields: {
          client: { $arrayElemAt: ['$client', 0] },
        },
      },
      { $count: 'count' },
    ];

    // Aggregate?
    const entriesFound = await this.entryRepository.aggregate(findAggregate);
    const countEntries = await this.entryRepository.aggregate(countAggregate);

    return {
      result: entriesFound,
      total: countEntries[0]?.count,
      page: skip,
      pages: Math.ceil(countEntries[0]?.count / limit) || 0,
      perPage: limit,
    };
  }

  /**
   * @name update
   * @param {Object} entry Object entry to update
   * @description Update the entry
   * @returns {Object} Returns the entry updated
   */
  async update(entry, entryId, executionCtx: Context): Promise<Entry> {
    const entryFound = await this.entryRepository.findById(entryId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(entryFound)) throw new NotFoundException('Entry not found');
    if (entryFound.deleted) throw new NotFoundException('Entry not found');

    entry.Id = entryId;
    entry.updatedBy = executionCtx.userId;
    const entryUpdated = await this.entryRepository.updateOne(entry);
    return entryUpdated;
  }

  /**
   * @name delete
   * @param {string} entryId Id from the order
   * @description Deletes the Entry but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(entryId, executionCtx: Context): Promise<Entry> {
    const entry = await this.entryRepository.findById(entryId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(entry)) throw new NotFoundException('Entry not found');
    if (entry.deleted) throw new BadRequestException('Entry already deleted');

    entry.deleted = true;
    entry.deletedBy = executionCtx.userId;
    return this.entryRepository.updateOne(entry);
  }
}
