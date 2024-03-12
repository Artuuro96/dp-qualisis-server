import { Module } from '@nestjs/common';
import { UtilController } from './utils.controller';
import { UtilService } from './utils.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtService } from '@nestjs/jwt';
import { AcmaClientModule } from 'src/client/client.module';

@Module({
  controllers: [UtilController],
  providers: [UtilService, JwtService],
  imports: [RepositoryModule, AcmaClientModule],
})
export class UtilModule {}
