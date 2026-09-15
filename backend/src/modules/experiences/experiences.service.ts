import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ExperienceStatus, Prisma } from '@prisma/client';

export interface ExperienceFilterDto {
  destination?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  maxGuests?: number;
  instantOnly?: boolean;
  featuredOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: ExperienceFilterDto) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(filter.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ExperienceWhereInput = {
      status: ExperienceStatus.PUBLISHED,
      ...(filter.featuredOnly ? { isFeatured: true } : {}),
      ...(filter.instantOnly ? { isInstantBook: true } : {}),
      ...(filter.category ? { category: { equals: filter.category, mode: 'insensitive' } } : {}),
      ...(filter.destination ? { destination: { slug: filter.destination } } : {}),
      ...(filter.maxPrice ? { pricePerPerson: { lte: filter.maxPrice } } : {}),
      ...(filter.minPrice ? { pricePerPerson: { gte: filter.minPrice } } : {}),
      ...(filter.maxGuests ? { maxGuests: { gte: filter.maxGuests } } : {}),
      ...(filter.search
        ? {
            OR: [
              { title: { contains: filter.search, mode: 'insensitive' } },
              { description: { contains: filter.search, mode: 'insensitive' } },
              { category: { contains: filter.search, mode: 'insensitive' } },
              { localProfile: { city: { contains: filter.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.experience.findMany({
        where,
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          destination: { select: { city: true, country: true, slug: true } },
          localProfile: {
            include: {
              user: { select: { id: true, name: true, avatar: true } },
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { ratingScore: 'desc' }, { reviewCount: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.experience.count({ where }),
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

  async findById(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        destination: true,
        localProfile: {
          include: {
            user: { select: { id: true, name: true, avatar: true, email: true } },
            availabilitySlots: {
              where: { date: { gte: new Date() } },
              orderBy: { date: 'asc' },
              take: 30,
            },
          },
        },
        reviews: {
          include: {
            author: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID "${id}" not found`);
    }

    return experience;
  }

  async create(userId: string, data: any) {
    const localProfile = await this.prisma.localProfile.findUnique({
      where: { userId },
    });

    if (!localProfile) {
      throw new ForbiddenException('User must have an approved Local Friend profile to create experiences');
    }

    return this.prisma.experience.create({
      data: {
        localProfileId: localProfile.id,
        destinationId: data.destinationId,
        title: data.title,
        description: data.description,
        category: data.category,
        durationHours: data.durationHours || 3.0,
        maxGuests: data.maxGuests || 4,
        pricePerPerson: data.pricePerPerson,
        currency: data.currency || 'USD',
        meetingPoint: data.meetingPoint,
        inclusions: data.inclusions || [],
        requirements: data.requirements || [],
        languages: data.languages || ['English'],
        status: data.status || ExperienceStatus.PUBLISHED,
        isInstantBook: data.isInstantBook ?? true,
        images: {
          create: data.images?.map((img: any, idx: number) => ({
            imageUrl: img.url || img,
            caption: img.caption || '',
            displayOrder: idx,
          })) || [],
        },
      },
      include: { images: true, localProfile: true },
    });
  }

  async update(id: string, userId: string, data: any) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: { localProfile: true },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.localProfile.userId !== userId) {
      throw new ForbiddenException('Not authorized to modify this experience');
    }

    return this.prisma.experience.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        durationHours: data.durationHours,
        maxGuests: data.maxGuests,
        pricePerPerson: data.pricePerPerson,
        meetingPoint: data.meetingPoint,
        inclusions: data.inclusions,
        requirements: data.requirements,
        languages: data.languages,
        status: data.status,
        isInstantBook: data.isInstantBook,
      },
      include: { images: true },
    });
  }
}
