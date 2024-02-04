import { Body, Controller, Get, Patch, Post, Param, Delete, Query } from '@nestjs/common';
import { Instrument } from '../repository/schemas/instrument.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { InstrumentService } from '../services/instrument.service';

@Controller('instruments')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post()
  async create(@Body() instrument: InstrumentDTO): Promise<Instrument> {
    return this.instrumentService.create(instrument);
  }

  @Get('/:instrumentId')
  async findById(@Param('instrumentId') instrumentId: string): Promise<Instrument> {
    return this.instrumentService.findById(instrumentId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.instrumentService.findAll(keyValue, skip, limit);
  }

  @Patch('/:instrumentId')
  async update(
    @Body() instrument: Partial<Instrument>,
    @Param('instrumentId') instrumentId: string,
  ): Promise<Instrument> {
    return this.instrumentService.update(instrument, instrumentId);
  }

  @Delete('/:instrumentId')
  async delete(@Param('instrumentId') instrumentId: string): Promise<Instrument> {
    return this.instrumentService.delete(instrumentId);
  }
}
