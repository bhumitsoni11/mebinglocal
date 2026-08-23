# Phase 4 AI Architecture

## Overview
The AI integration layer in MebingLocal uses a centralized, secure, and modular architecture. 
All AI requests from the frontend are routed through the NestJS backend, which acts as a secure intermediary.

## Core Modules
- **OpenaiModule**: Centralized service for OpenAI communication. Handles initialization, logging, structured output validation, and cost tracking.
- **RedisModule**: Caching layer built on Upstash to store reusable AI responses and reduce API costs.
- **AiModule**: Contains feature-specific services and controllers (e.g., Assistant, Itinerary, Matching).

## Data Flow
Frontend -> Backend (AiController) -> Prisma (Context Building) -> OpenaiService -> OpenAI API -> Backend -> Frontend
