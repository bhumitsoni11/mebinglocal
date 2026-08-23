export function buildMatchingPrompt(travelerPrefs: any, candidateProfiles: any[]): string {
  return `You are an AI matching engine for MebingLocal.
Your task is to rank the candidate Local Friends based on the traveler's preferences.
Consider interests, languages, and general travel style.
Return a valid JSON object containing a "matches" array.
Each match should have "localFriendId" (string), "matchScore" (number 0-100), and "reasons" (array of strings explaining why).

Traveler Preferences:
${JSON.stringify(travelerPrefs, null, 2)}

Candidate Local Friends:
${JSON.stringify(candidateProfiles, null, 2)}

Example output:
{
  "matches": [
    {
      "localFriendId": "uuid-here",
      "matchScore": 94,
      "reasons": [
        "Strong photography interest",
        "Speaks preferred language"
      ]
    }
  ]
}`;
}
