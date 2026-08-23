import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentOrderDto {
  @ApiProperty()
  @IsString()
  bookingId: string;
}
