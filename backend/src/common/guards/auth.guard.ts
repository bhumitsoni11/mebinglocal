import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private clerkClient: ReturnType<typeof createClerkClient>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY') || 'mock_secret_key';
    const publishableKey = this.configService.get<string>('CLERK_PUBLISHABLE_KEY');
    this.clerkClient = createClerkClient({ secretKey, publishableKey });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. Verify token with Clerk
      const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
      
      let clerkUserId: string;

      if (!secretKey || secretKey.startsWith('sk_test_placeholder') || secretKey === 'mock_secret_key') {
        // In local development without real Clerk keys, decode or mock safely
        this.logger.debug('Using development fallback for Clerk token verification');
        clerkUserId = 'user_dev_traveler_001';
      } else {
        const verifiedToken = await verifyToken(token, { secretKey });
        clerkUserId = verifiedToken.sub;
      }

      if (!clerkUserId) {
        throw new UnauthorizedException('Invalid Clerk token');
      }

      // 2. Fetch or sync user from Postgres
      let user = await this.prisma.user.findUnique({
        where: { clerkUserId },
        include: {
          travelerProfile: true,
          localProfile: true,
        },
      });

      if (!user) {
        // Lazy-sync user record
        try {
          const clerkUser = await this.clerkClient.users.getUser(clerkUserId);
          const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkUserId}@placeholder.mebinglocal.com`;
          const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Traveler';
          const avatar = clerkUser.imageUrl || null;

          user = await this.prisma.user.create({
            data: {
              clerkUserId,
              email,
              name,
              avatar,
            },
            include: {
              travelerProfile: true,
              localProfile: true,
            },
          });
        } catch (syncError) {
          // If Clerk API fails, create minimal user record
          user = await this.prisma.user.create({
            data: {
              clerkUserId,
              email: `${clerkUserId}@mebinglocal.user`,
              name: 'MebingLocal User',
            },
            include: {
              travelerProfile: true,
              localProfile: true,
            },
          });
        }
      }

      // Attach user to request
      request.user = user;
      request.clerkUserId = clerkUserId;

      return true;
    } catch (error) {
      this.logger.error(`Clerk authentication failed: ${error.message}`);
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }
}
