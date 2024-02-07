import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Client, ClientDocument } from '../schemas/client.schema';

export class ClientRepository {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
  ) {}
  async create(client: Client): Promise<Client> {
    return this.clientModel.create(client);
  }

  async find(findOptiopns): Promise<Client[]> {
    const { query, projection, options } = findOptiopns;
    const clientFind = this.clientModel.find(query);
    if (!isNil(projection)) clientFind.projection(projection);
    if (isNil(options)) return clientFind;

    const { limit, skip } = options;
    if (!isNil(limit)) clientFind.limit(limit);
    if (!isNil(skip)) clientFind.skip(skip);

    return clientFind;
  }

  async count(query): Promise<number> {
    return this.clientModel.countDocuments(query);
  }

  async findById(clientId, projection?): Promise<Client> {
    return this.clientModel.findById(clientId, projection);
  }

  async updateOne(client): Promise<Client> {
    return this.clientModel.findOneAndUpdate({ _id: client._id }, client, {
      new: true,
    });
  }
}
