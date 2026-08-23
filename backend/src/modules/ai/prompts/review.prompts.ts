export function buildReviewSummaryPrompt(localFriendName: string, reviews: any[]): string {
  return `You are a review summarizer for MebingLocal.
Your task is to summarize the following reviews for a Local Friend named ${localFriendName}.
Do not invent information. Base your summary strictly on the provided reviews.
Return a valid JSON object containing an "overall" string, a "strengths" array (strings), and a "weaknesses" array (strings).

Reviews:
${JSON.stringify(reviews, null, 2)}

Example output:
{
  "overall": "Travelers generally describe ${localFriendName} as friendly and punctual.",
  "strengths": ["Food recommendations", "Communication", "Local knowledge"],
  "weaknesses": ["Limited availability on weekends"]
}`;
}
