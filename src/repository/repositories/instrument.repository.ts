import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Instrument, InstrumentDocument } from '../schemas/instrument.schema';

export class InstrumentRepository {
  constructor(
    @InjectModel(Instrument.name)
    private instrumentModel: Model<InstrumentDocument>,
  ) {}
  async create(instrument: Instrument): Promise<Instrument> {
    return this.instrumentModel.create(instrument);
  }

  async find(findOptiopns): Promise<Instrument[]> {
    const { query, projection, options } = findOptiopns;
    const instrumentFind = this.instrumentModel.find(query);
    if (!isNil(projection)) instrumentFind.projection(projection);
    if (isNil(options)) return instrumentFind;

    const { limit, skip } = options;
    if (!isNil(limit)) instrumentFind.limit(limit);
    if (!isNil(skip)) instrumentFind.skip(skip);

    return instrumentFind;
  }

  async count(query): Promise<number> {
    return this.instrumentModel.countDocuments(query);
  }

  async findById(instrumentId, projection?): Promise<Instrument> {
    return this.instrumentModel.findById(instrumentId, projection);
  }

  async updateOne(instrument): Promise<Instrument> {
    return this.instrumentModel.findOneAndUpdate(
      { _id: instrument._id },
      instrument,
      {
        new: true,
      },
    );
  }
}
