import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Client } from '../repository/schemas/client.schema';
import { PaginateResult } from '../repository/interfaces/paginateResult.interface';
import { ClientDTO } from '../dtos/client.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { ClientService } from './client.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@Controller('clients')
@UseGuards(AuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() client: ClientDTO, @ExecutionCtx() executionCtx: Context): Promise<Client> {
    return this.clientService.create(client, executionCtx);
  }

  @Get('/:clientId')
  async findById(@Param('clientId') clientId: string): Promise<Client> {
    return this.clientService.findById(clientId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.clientService.findAll(keyValue, skip, limit);
  }

  @Patch('/:clientId')
  async update(
    @Body() client: Partial<Client>,
    @Param('clientId') clientId: string,
    @ExecutionCtx() executionCtx: Context,
  ): Promise<Client> {
    return this.clientService.update(client, clientId, executionCtx);
  }

  @Delete('/:clientId')
  async delete(@Param('clientId') clientId: string, @ExecutionCtx() executionCtx: Context): Promise<Client> {
    return this.clientService.delete(clientId, executionCtx);
  }
}
