import {
    IsString,
    IsNotEmpty,
    IsDefined,
    IsOptional,
  } from 'class-validator';
  
  export class InstrumentDTO {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    clientId: string;

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