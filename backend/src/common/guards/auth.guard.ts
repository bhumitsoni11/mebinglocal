import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        jwtKey: process.env.CLERK_JWT_KEY, // Optional, for quicker local verification
      });

      // Attach user payload to the request for the @CurrentUser decorator
      let dbUser = await this.prisma.user.findUnique({
        where: { clerkId: verifiedToken.sub },
      });

      if (!dbUser) {
        // Lazy sync: fetch user details from Clerk and create in our DB
        const { createClerkClient } = require('@clerk/backend');
        const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const clerkUser = await clerkClient.users.getUser(verifiedToken.sub);
        
        const primaryEmail = clerkUser.emailAddresses.find(
          email => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;

        if (!primaryEmail) {
          throw new UnauthorizedException('User must have an email address');
        }

        const isAdmin = ['sonibhumit196@gmail.com', 'ramtakenamrata632@gmail.com'].includes(primaryEmail.toLowerCase());

        if (isAdmin) {
          const isGoogle = clerkUser.externalAccounts?.some((acc: any) => acc.provider === 'oauth_google');
          if (!isGoogle) {
            throw new UnauthorizedException('Admins must sign in with Google');
          }
        }

        dbUser = await this.prisma.user.create({
          data: {
            clerkId: verifiedToken.sub,
            email: primaryEmail,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            avatarUrl: clerkUser.imageUrl,
            role: isAdmin ? 'ADMIN' : 'TRAVELER',
          }
        });
        
        this.logger.log(`Lazy synced user ${dbUser.id} (${primaryEmail}) with role ${dbUser.role}`);
      }

      request.user = dbUser;
      request.clerkToken = verifiedToken;

      return true;
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
