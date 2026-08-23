import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  localFriendId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experienceId?: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty()
  @IsNumber()
  totalAmount: number; // Minor units

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  meetingLocation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
