import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class ItineraryRequestDto {
  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @Min(1)
  @Max(14)
  days: number;

  @IsNumber()
  @Min(0)
  budget: number; // Stored as integer currency (e.g. INR rupees, USD dollars)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  travelStyle?: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  groupSize?: number;

  @IsString()
  @IsOptional()
  optionalPreferences?: string;
}
