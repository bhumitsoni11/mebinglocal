import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

export class MatchingRequestDto {
  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxHourlyRate?: number;
}
