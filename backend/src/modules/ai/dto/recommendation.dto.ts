import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RecommendationRequestDto {
  @IsString()
  @IsOptional()
  destination?: string;
  
  @IsString()
  @IsOptional()
  category?: string; // e.g. LOCAL_FRIENDS, EXPERIENCES, LOCAL_PULSE
}
