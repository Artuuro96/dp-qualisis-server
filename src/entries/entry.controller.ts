import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Entry } from '../repository/schemas/entry.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { EntryDTO } from '../dtos/entry.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { EntryService } from './entry.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@Controller('entries')
@UseGuards(AuthGuard)
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  async create(@Body() entry: EntryDTO, @ExecutionCtx() executionCtx: Context): Promise<Entry> {
    return this.entryService.create(entry, executionCtx);
  }

  @Get('/:entryId')
  async findById(@Param('entryId') entryId: string): Promise<Entry> {
    return this.entryService.findById(entryId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.entryService.findAll(keyValue, skip, limit);
  }

  @Patch('/:entryId')
  async update(
    @Body() entry: Partial<Entry>,
    @Param('entryId') entryId: string,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Entry> {
    return this.entryService.update(entry, entryId, executionCtx);
  }

  @Delete('/:entryId')
  async delete(@Param('entryId') entryId: string, @ExecutionCtx() executionCtx: Context): Promise<Entry> {
    return this.entryService.delete(entryId, executionCtx);
  }
}
