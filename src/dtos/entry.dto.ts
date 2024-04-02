import { IsString, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EntryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  orderNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  description?: string;
}
