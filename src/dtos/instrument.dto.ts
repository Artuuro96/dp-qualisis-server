import { IsString, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';

export class InstrumentDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  entryId: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
