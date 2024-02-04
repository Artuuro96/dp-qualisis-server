import { Module } from '@nestjs/common';
import { OrderEquipmentController } from '../controllers/order-equipment.controller';
import { OrderEquipmentService } from '../services/orderEquipment.service';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  controllers: [OrderEquipmentController],
  providers: [OrderEquipmentService],
  imports: [RepositoryModule],
})
export class OrderEquipmentModule {}