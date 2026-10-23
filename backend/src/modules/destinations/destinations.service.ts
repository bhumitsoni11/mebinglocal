import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma } from '@prisma/client';

export interface DestinationQueryDto {
  isTrending?: boolean;
  search?: string;
  country?: string;
  region?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: DestinationQueryDto) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(200, Number(query?.limit) || 50));
    const skip = (page - 1) * limit;

    const where: Prisma.DestinationWhereInput = {
      ...(query?.isTrending !== undefined ? { isTrending: query.isTrending } : {}),
      ...(query?.country ? { country: { equals: query.country, mode: 'insensitive' } } : {}),
      ...(query?.region ? { region: { equals: query.region, mode: 'insensitive' } } : {}),
      ...(query?.search
        ? {
            OR: [
              { city: { contains: query.search, mode: 'insensitive' } },
              { country: { contains: query.search, mode: 'insensitive' } },
              { region: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.destination.findMany({
        where,
        include: {
          _count: {
            select: {
              locals: true,
              experiences: true,
              pulsePosts: true,
            },
          },
        },
        orderBy: [{ isTrending: 'desc' }, { localCount: 'desc' }, { city: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.destination.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        locals: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          take: 12,
        },
        experiences: {
          where: { status: 'PUBLISHED' },
          include: {
            images: true,
            localProfile: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
          },
          take: 8,
        },
        pulsePosts: {
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: {
            localProfile: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
          },
        },
      },
    });

    if (!destination) {
      throw new NotFoundException(`Destination with slug "${slug}" not found`);
    }

    return destination;
  }

  async getCountries() {
    const destinations = await this.prisma.destination.findMany({
      select: { country: true, region: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });
    return destinations.map((d) => d.country);
  }

  async findOrCreateDestination(data: {
    city: string;
    country: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    heroImage?: string;
    description?: string;
  }) {
    const slug = `${data.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${data.country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-+|-+$/g, '');

    return this.prisma.destination.upsert({
      where: { slug },
      update: {
        city: data.city,
        country: data.country,
        region: data.region || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
      },
      create: {
        slug,
        city: data.city,
        country: data.country,
        region: data.region || 'Global Region',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        heroImage: data.heroImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80',
        description: data.description || `Discover authentic local experiences and resident friends across ${data.city}, ${data.country}.`,
        weatherNote: '22°C · Vibrant & Welcoming',
        avgPrice: 35.0,
        isTrending: false,
      },
    });
  }
}
