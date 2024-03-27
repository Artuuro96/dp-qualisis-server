import { IsString, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstrumentDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  entryId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: false,
  })
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  description?: string;
}
