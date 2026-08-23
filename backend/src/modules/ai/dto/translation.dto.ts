import { IsString, IsNotEmpty } from 'class-validator';

export class TranslationRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  sourceLanguage: string;

  @IsString()
  @IsNotEmpty()
  targetLanguage: string;
}
