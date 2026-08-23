export function buildRecommendationPrompt(travelerPrefs: any, candidates: any[]): string {
  return `You are a recommendation engine for MebingLocal.
Your task is to select the top recommendations for the traveler from the provided candidates.
Consider the traveler's past interactions, bookings, and stated preferences.
Return a valid JSON array of objects containing "itemId", "score" (0-100), and "reason".

Traveler Data:
${JSON.stringify(travelerPrefs, null, 2)}

Candidates:
${JSON.stringify(candidates, null, 2)}

Example output:
{
  "recommendations": [
    {
      "itemId": "uuid",
      "score": 90,
      "reason": "Highly rated food tour matching your culinary interests."
    }
  ]
}`;
}
