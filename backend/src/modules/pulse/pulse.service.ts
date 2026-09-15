import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class PulseService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(destinationSlug?: string, vibe?: string) {
    let destinationId: string | undefined;

    if (destinationSlug) {
      const destination = await this.prisma.destination.findUnique({
        where: { slug: destinationSlug },
      });
      if (destination) {
        destinationId = destination.id;
      }
    }

    return this.prisma.pulsePost.findMany({
      where: {
        ...(destinationId ? { destinationId } : {}),
        ...(vibe && vibe !== 'all' ? { vibeCategory: vibe } : {}),
      },
      include: {
        destination: { select: { city: true, country: true, slug: true } },
        localProfile: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async upvote(postId: string) {
    const post = await this.prisma.pulsePost.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.pulsePost.update({
      where: { id: postId },
      data: { upvotesCount: { increment: 1 } },
    });
  }
}
