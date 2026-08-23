export function buildDiscoveryPrompt(): string {
  return `You are a search intent parser for MebingLocal.
Extract structured filters from the user's natural language query.
Return a valid JSON object containing:
- "interests": array of strings (e.g. ["Food", "Photography"])
- "timeOfDay": string (e.g. "Morning", "Afternoon", "Evening") or null
- "travelStyle": string (e.g. "Relaxed", "Adventure") or null
- "destination": string (e.g. "Jaipur") or null
- "budget": number (extracted max budget if mentioned) or null

Do not invent filters if they are not implied by the query.
`;
}
