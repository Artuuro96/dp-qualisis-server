import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsEnum,
} from 'class-validator';
import { StatusEnum } from '../repository/enums/status.enum';

export class OrderDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEnum(StatusEnum, {
    message:
      'El valor de "status" debe ser uno de: COMPLETED, ASSIGNED, FINISHED, CREATED, IN_PROGRESS',
  })
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  workerId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
