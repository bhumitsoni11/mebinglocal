import { IsString, IsNotEmpty } from 'class-validator';

export class DiscoveryRequestDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
