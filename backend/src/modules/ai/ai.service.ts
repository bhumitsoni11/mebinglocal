import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { User } from '@prisma/client';
import OpenAI from 'openai';

export interface GenerateItineraryDto {
  destination: string;
  durationDays?: number;
  prompt?: string;
  travelStyle?: string;
  pace?: string;
  budget?: string;
  companions?: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && !apiKey.startsWith('sk-proj-placeholder')) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generateItinerary(user: User | null, dto: GenerateItineraryDto) {
    const destination = dto.destination || 'Kyoto, Japan';
    const durationDays = Math.max(1, Math.min(14, Number(dto.durationDays) || 4));

    // 1. Fetch real local friends and experiences in destination from DB
    const matchingLocals = await this.prisma.localProfile.findMany({
      where: {
        OR: [
          { city: { contains: destination.split(',')[0].trim(), mode: 'insensitive' } },
          { destination: { city: { contains: destination.split(',')[0].trim(), mode: 'insensitive' } } },
        ],
        verificationStatus: 'APPROVED',
      },
      include: {
        user: { select: { name: true, avatar: true } },
        experiences: { select: { id: true, title: true, pricePerPerson: true, durationHours: true } },
      },
      take: 5,
    });

    let generatedDays = [];

    if (this.openai) {
      try {
        const systemPrompt = `You are the MebingLocal Intelligent Travel Concierge. You design intimate, cultural, non-touristy itineraries co-created with verified resident hosts.
Available Local Hosts in ${destination}: ${JSON.stringify(matchingLocals.map((l) => ({ id: l.id, name: l.user.name, tagline: l.tagline, expertise: l.expertise, experiences: l.experiences })))}
Return JSON with format:
{
  "title": "Title of the itinerary",
  "summary": "2-3 sentence evocative summary",
  "matchScore": 98,
  "budgetEstimate": "$150 - $250/day",
  "days": [
    {
      "dayNumber": 1,
      "themeTitle": "Theme of day",
      "activities": [
        {
          "timeSlot": "09:30 AM",
          "title": "Activity title",
          "description": "Engaging description",
          "neighborhood": "Area name",
          "matchedLocalId": "local_id_if_applicable"
        }
      ]
    }
  ]
}`;

        const userPrompt = `Craft a ${durationDays}-day itinerary for ${destination}.
Traveler Preferences:
- Vision: "${dto.prompt || 'Tranquil cultural journey'}"
- Style: ${dto.travelStyle || 'Slow Cultural'}
- Pace: ${dto.pace || '2-3 spots per day'}
- Budget: ${dto.budget || 'Moderate'}
- Companions: ${dto.companions || 'Solo Explorer'}`;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return {
          ...parsed,
          matchingLocals,
        };
      } catch (err) {
        this.logger.warn(`OpenAI call fallback: ${err.message}`);
      }
    }

    // High quality deterministic fallback matching Stitch design exactly
    const fallbackDays = [
      {
        dayNumber: 1,
        themeTitle: 'Low-City Arrival & Artisan Alleyways',
        activities: [
          {
            timeSlot: '09:30 AM',
            title: 'Morning Senbei Tasting & Historic Alleys',
            description: 'Visit a 70-year-old family senbei shop with hand-flipped binchotan charcoal crackers.',
            neighborhood: 'Yanaka Ginza',
            matchedLocalId: matchingLocals[0]?.id || null,
          },
          {
            timeSlot: '02:00 PM',
            title: 'Vintage Kissaten & Tatami Coffee Corner',
            description: 'Sip matcha lattes on tatami mats under raw timber joists at Kayaba Coffee (est. 1916).',
            neighborhood: 'Near Nezu Shrine',
            matchedLocalId: matchingLocals[0]?.id || null,
          },
          {
            timeSlot: '06:30 PM',
            title: 'Low-Key Yakitori & Craft Beer in Yanaka',
            description: 'Intimate counter dining with local neighbors and seasonal skewers.',
            neighborhood: 'Sendagi Crossway',
            matchedLocalId: null,
          },
        ],
      },
      {
        dayNumber: 2,
        themeTitle: 'Ceramic Mastery & Zen Tea Forests',
        activities: [
          {
            timeSlot: '09:30 AM',
            title: 'Private Uji Morning Matcha Session',
            description: 'Private matcha session at a 180-year-old wooden teahouse off the tourist trail.',
            neighborhood: 'Uji Suburb',
            matchedLocalId: matchingLocals[1]?.id || matchingLocals[0]?.id || null,
          },
          {
            timeSlot: '02:00 PM',
            title: 'Hands-on Ceramic Wheel Session',
            description: 'Throwing local clay and glazing your own chawan bowl with a 5th generation artisan.',
            neighborhood: 'Kiyomizu Slope',
            matchedLocalId: matchingLocals[1]?.id || matchingLocals[0]?.id || null,
          },
          {
            timeSlot: '06:00 PM',
            title: 'Obanzai Dinner & Microbrew Tasting',
            description: 'Seasonal heirloom vegetables and rare Kyoto craft beers in Gion backstreets.',
            neighborhood: 'Gion Alley',
            matchedLocalId: null,
          },
        ],
      },
      {
        dayNumber: 3,
        themeTitle: 'Hidden Courtyards & Natural Wine',
        activities: [
          {
            timeSlot: '10:00 AM',
            title: 'Marbled Paper & Woodcraft Atelier Tour',
            description: 'Exclusive access to generational leathercraft and bookbinding workshops.',
            neighborhood: 'Artisan Quarter',
            matchedLocalId: matchingLocals[0]?.id || null,
          },
          {
            timeSlot: '04:00 PM',
            title: 'Sunset Wine Window & Small Plates',
            description: 'Experience authentic neighborhood wine pairings at historic buchette.',
            neighborhood: 'Riverbank',
            matchedLocalId: null,
          },
        ],
      },
      {
        dayNumber: 4,
        themeTitle: 'Market Morning & Local Farewell',
        activities: [
          {
            timeSlot: '08:00 AM',
            title: 'Dawn Outer Market Sashimi & Knife Blacksmiths',
            description: 'Taste tamagoyaki fresh from the griddle and meet master Sakai blade sharpeners.',
            neighborhood: 'Outer Market',
            matchedLocalId: matchingLocals[0]?.id || null,
          },
        ],
      },
    ].slice(0, durationDays);

    return {
      title: `${destination} Cultural Odyssey`,
      summary: `An unscripted ${durationDays}-day journey pairing quiet craft quarters with verified local resident hosts.`,
      matchScore: 98,
      budgetEstimate: dto.budget || '$150 - $250/day',
      days: fallbackDays,
      matchingLocals,
    };
  }

  async translateText(text: string, targetLanguage: string) {
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Translate the following user message accurately and culturally to ${targetLanguage}. Return only the translated text.`,
            },
            { role: 'user', content: text },
          ],
        });
        return {
          original: text,
          translated: response.choices[0].message.content.trim(),
          targetLanguage,
        };
      } catch (err) {
        this.logger.warn(`Translation error: ${err.message}`);
      }
    }

    return {
      original: text,
      translated: `[${targetLanguage}] ${text}`,
      targetLanguage,
    };
  }
}
