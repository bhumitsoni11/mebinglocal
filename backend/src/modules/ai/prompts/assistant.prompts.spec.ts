import { buildAssistantSystemPrompt } from './assistant.prompts';

describe('buildAssistantSystemPrompt', () => {
  it('should include context if provided', () => {
    const context = { travelStyle: 'Adventure' };
    const prompt = buildAssistantSystemPrompt(context);
    expect(prompt).toContain('Traveler Context');
    expect(prompt).toContain('Adventure');
  });

  it('should not include context block if empty', () => {
    const prompt = buildAssistantSystemPrompt(null);
    expect(prompt).not.toContain('Traveler Context');
  });
});
