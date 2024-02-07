import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Instrument } from '../repository/schemas/instrument.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { InstrumentService } from './instrument.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@Controller('instruments')
@UseGuards(AuthGuard)
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post()
  async create(
    @Body() instrument: InstrumentDTO,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Instrument> {
    return this.instrumentService.create(instrument, executionCtx);
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
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Instrument> {
    return this.instrumentService.update(instrument, instrumentId, executionCtx);
  }

  @Delete('/:instrumentId')
  async delete(
    @Param('instrumentId') instrumentId: string,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Instrument> {
    return this.instrumentService.delete(instrumentId, executionCtx);
  }
}
