import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { isTrending?: boolean }) {
    return this.prisma.destination.findMany({
      where: query?.isTrending !== undefined ? { isTrending: query.isTrending } : undefined,
      include: {
        _count: {
          select: {
            locals: true,
            experiences: true,
            pulsePosts: true,
          },
        },
      },
      orderBy: { localCount: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
      include: {
        locals: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
          take: 8,
        },
        experiences: {
          where: { status: 'PUBLISHED' },
          include: {
            images: true,
            localProfile: {
              include: {
                user: { select: { name: true, avatar: true } },
              },
            },
          },
          take: 6,
        },
        pulsePosts: {
          take: 6,
          orderBy: { createdAt: 'desc' },
          include: {
            localProfile: {
              include: {
                user: { select: { name: true, avatar: true } },
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
}
