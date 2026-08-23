import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTravelerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false, type: Object })
  @IsObject()
  @IsOptional()
  travelStyle?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  budgetLevel?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interestIds?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languageIds?: string[];
}
