import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtService } from '@nestjs/jwt';
import { AcmaClientModule } from 'src/client/client.module';

@Module({
  controllers: [EntryController],
  providers: [EntryService, JwtService],
  imports: [RepositoryModule, AcmaClientModule],
})
export class EntryModule {}
