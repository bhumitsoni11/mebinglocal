import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class AssistantRequestDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsObject()
  @IsOptional()
  contextOverrides?: Record<string, any>;
}
