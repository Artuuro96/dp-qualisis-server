import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from '../repository/repositories/client.repository';
import { Client } from '../repository/schemas/client.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { ClientDTO } from '../dtos/client.dto';
import { isNil } from 'lodash';
import { Context } from 'src/auth/context/execution-ctx';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  /**
   * @name create
   * @param {object} client Object client to create
   * @description Creates a client
   * @returns {Object} Returns the client
   */
  async create(client: ClientDTO, executionCtx: Context): Promise<Client> {
    const newClient: Client = {
      ...client,
      createdBy: executionCtx.userId,
    };

    const clientCreated = await this.clientRepository.create(newClient);
    return clientCreated;
  }

  /**
   * @name findById
   * @param {string} clientId Id from the client
   * @description Finds a client with his ID
   * @returns {Object} Returns the client found
   */
  async findById(clientId): Promise<Client> {
    const clientFound = await this.clientRepository.findById(clientId);
    if (isNil(clientFound)) throw new NotFoundException('client not found');
    if (clientFound.deleted) throw new NotFoundException('client not found');
    return clientFound;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the client paginated
   * @returns {PaginateResult} Object with the client paginate
   */
  async findAll(keyValue = '', skip = 0, limit?: number): Promise<PaginateResult> {
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

    const clients = await this.clientRepository.find({
      query,
      options,
    });
    const countclients = await this.clientRepository.count(query);
    return {
      result: clients,
      total: countclients,
      page: skip,
      pages: Math.ceil(countclients / limit) || 0,
    };
  }

  /**
   * @name update
   * @param {Object} client Object client to update
   * @description Update the client
   * @returns {Object} Returns the client updated
   */
  async update(client, clientId, executionCtx: Context): Promise<Client> {
    const clientFound = await this.clientRepository.findById(clientId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(clientFound)) throw new NotFoundException('Client not found');
    if (clientFound.deleted) throw new NotFoundException('Client not found');

    client.Id = clientId;
    client.updatedBy = executionCtx.userId;
    const clientUpdated = await this.clientRepository.updateOne(client);
    return clientUpdated;
  }

  /**
   * @name delete
   * @param {string} clientId Id from the client
   * @description Deletes the client but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(clientId, executionCtx: Context): Promise<Client> {
    const client = await this.clientRepository.findById(clientId, {
      _id: 1,
      deleted: 1,
    });

    if (isNil(client)) throw new NotFoundException('Client not found');
    if (client.deleted) throw new BadRequestException('Client already deleted');

    client.deleted = true;
    client.deletedBy = executionCtx.userId;
    return this.clientRepository.updateOne(client);
  }
}
