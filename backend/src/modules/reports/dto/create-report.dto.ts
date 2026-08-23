import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reportedId?: string;

  @ApiProperty()
  @IsString()
  reportType: string; // USER, REVIEW, LOCAL_PULSE, EXPERIENCE, MESSAGE

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
