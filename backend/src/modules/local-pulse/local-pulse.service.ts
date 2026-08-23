import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateLocalPulseDto } from './dto/create-local-pulse.dto';
import { LocalPulseStatus } from '@prisma/client';

@Injectable()
export class LocalPulseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateLocalPulseDto) {
    const { mediaUrls, ...postData } = data;
    
    // Default processingStatus as COMPLETED for Phase 3 since AI is disabled
    const post = await this.prisma.localPulsePost.create({
      data: {
        ...postData,
        authorId: userId,
        status: LocalPulseStatus.PUBLISHED,
        processingStatus: 'COMPLETED',
        media: mediaUrls ? {
          create: mediaUrls.map(url => ({
            url,
            mediaType: 'IMAGE', // simplify for Phase 3
          }))
        } : undefined,
      },
      include: { media: true },
    });

    return post;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.prisma.localPulsePost.findMany({
        where: { status: LocalPulseStatus.PUBLISHED },
        include: {
          author: { select: { firstName: true, lastName: true, avatarUrl: true } },
          media: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.localPulsePost.count({ where: { status: LocalPulseStatus.PUBLISHED } }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(userId: string, id: string) {
    const post = await this.prisma.localPulsePost.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.prisma.localPulsePost.delete({ where: { id } });
  }
}
