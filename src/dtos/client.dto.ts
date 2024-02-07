import { IsString, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';

export class ClientDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
