# AI Security & PII Protection

## 1. API Key Protection
- The OpenAI API Key is stored securely in the backend environment variables (`.env`).
- It is NEVER exposed to the frontend.

## 2. PII Minimization
- The backend sanitizes user records before sending them to OpenAI.
- Fields like email, phone number, clerkId, and payment details are stripped out.
- Only travel-relevant data (budget, style, interests, language) is passed to the AI models.

## 3. Fallback Handling
- The `OpenaiService` intercepts 429 (Rate Limit), 401 (Auth), and 500 (Timeout) errors from OpenAI and converts them into safe, generic JSON error responses (`AI_TEMPORARILY_UNAVAILABLE`) to prevent leaking internal stack traces.

## 4. Safety Intelligence Rules
- Safety scores analyze platform-level trust (verification, booking success) without discriminating based on demographics.
