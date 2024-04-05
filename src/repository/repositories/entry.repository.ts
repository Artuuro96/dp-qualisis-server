import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Entry, EntryDocument } from '../schemas/entry.schema';

export class EntryRepository {
  constructor(
    @InjectModel(Entry.name)
    private entryModel: Model<EntryDocument>,
  ) {}
  async create(entry: Entry): Promise<Entry> {
    return this.entryModel.create(entry);
  }

  async find(findOptiopns): Promise<Entry[]> {
    const { query, projection, options } = findOptiopns;
    const entryFind = this.entryModel.find(query);
    if (!isNil(projection)) entryFind.projection(projection);
    if (isNil(options)) return entryFind;

    const { limit, skip } = options;
    if (!isNil(limit)) entryFind.limit(limit);
    if (!isNil(skip)) entryFind.skip(skip);

    return entryFind;
  }

  async count(query): Promise<number> {
    return this.entryModel.countDocuments(query);
  }

  async findById(entryId, projection?): Promise<Entry> {
    return this.entryModel.findById(entryId, projection);
  }

  async updateOne(entry): Promise<Entry> {
    return this.entryModel.findOneAndUpdate({ _id: entry._id }, entry, {
      new: true,
    });
  }

  async aggregate(aggregateQuery): Promise<any> {
    return this.entryModel.aggregate(aggregateQuery);
  }
}
