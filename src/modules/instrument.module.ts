import { Module } from '@nestjs/common';
import { InstrumentController } from '../controllers/instrument.controller';
import { InstrumentService } from '../services/instrument.service';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  controllers: [InstrumentController],
  providers: [InstrumentService],
  imports: [RepositoryModule],
})
export class InstrumentModule {}
