export function buildTranslationPrompt(sourceLanguage: string, targetLanguage: string): string {
  return `You are a travel translation assistant for MebingLocal.
Translate the user's text from ${sourceLanguage} to ${targetLanguage}.
Preserve meaning, tone, names, locations, and travel terminology.
Return a valid JSON object containing exactly one key: "translatedText".`;
}
