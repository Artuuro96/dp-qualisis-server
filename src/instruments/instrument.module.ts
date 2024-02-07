import { Module } from '@nestjs/common';
import { InstrumentController } from './instrument.controller';
import { InstrumentService } from './instrument.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtService } from '@nestjs/jwt';
import { AcmaClientModule } from 'src/client/client.module';

@Module({
  controllers: [InstrumentController],
  providers: [InstrumentService, JwtService],
  imports: [RepositoryModule, AcmaClientModule],
})
export class InstrumentModule {}
