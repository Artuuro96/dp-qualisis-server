import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtService } from '@nestjs/jwt';
import { AcmaClientModule } from 'src/client/client.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService, JwtService],
  imports: [RepositoryModule, AcmaClientModule],
})
export class ClientModule {}
