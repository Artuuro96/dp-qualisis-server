import { IsString, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientDTO {
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
  description?: string;
}
