import { IsString, IsNotEmpty, IsOptional, IsDefined, IsEnum } from 'class-validator';
import { StatusEnum } from '../repository/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEnum(StatusEnum, {
    message: 'El valor de "status" debe ser uno de: COMPLETED, ASSIGNED, FINISHED, CREATED, IN_PROGRESS',
  })
  @ApiProperty({
    required: true,
  })
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  workerId: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  startDate?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endDate?: string;
}
