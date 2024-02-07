import { IsString, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';

export class EntryDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
