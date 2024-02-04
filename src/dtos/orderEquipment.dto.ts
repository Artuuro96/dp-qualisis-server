import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class OrderEquipmentDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  instrumentId: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  orderId: string;
}
