import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test traveler for reviews
  const traveler = await prisma.user.upsert({
    where: { email: 'traveler@test.com' },
    update: {},
    create: {
      clerkId: 'traveler-test-id',
      email: 'traveler@test.com',
      firstName: 'Jessica',
      lastName: 'M',
      role: Role.TRAVELER,
    },
  });

  const lfData = [
    {
      email: 'priya@test.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      clerkId: 'lf1-id',
      avatarUrl: "https://images.unsplash.com/photo-1534777367038-9404f45b869a?w=200&h=200&fit=crop&auto=format",
      profile: {
        bio: "Born and raised in Mumbai, I know every chai stall and secret viewpoint this city has. I specialize in showing the real Mumbai — the one tourists never see.",
        hourlyRate: 1200, // cents
        location: "Mumbai, India",
        isVerified: true,
        rating: 4.96,
        totalReviews: 142,
      },
    },
    {
      email: 'carlos@test.com',
      firstName: 'Carlos',
      lastName: 'Mendez',
      clerkId: 'lf2-id',
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&auto=format",
      profile: {
        bio: "Third-generation Barcelonan. I'll take you to the tapas bars my grandfather built, and the rooftops no guidebook knows about.",
        hourlyRate: 1800,
        location: "Barcelona, Spain",
        isVerified: true,
        rating: 4.91,
        totalReviews: 98,
      },
    }
  ];

  for (const lf of lfData) {
    const user = await prisma.user.upsert({
      where: { email: lf.email },
      update: {},
      create: {
        clerkId: lf.clerkId,
        email: lf.email,
        firstName: lf.firstName,
        lastName: lf.lastName,
        avatarUrl: lf.avatarUrl,
        role: Role.LOCAL_FRIEND,
        localFriendProfile: {
          create: {
            ...lf.profile
          }
        }
      }
    });
    
    if (lf.email === 'priya@test.com') {
      // Add a post & event
      await prisma.localPulsePost.create({
        data: {
          authorId: user.id,
          content: "Navratri Night Celebration",
          location: "Ahmedabad, India",
          status: 'PUBLISHED',
          processingStatus: 'COMPLETED',
          events: {
            create: {
              title: "Navratri Night Celebration",
              description: "Nine nights of music, dance, and color. Join us for the world's largest folk dance celebration with 10,000 participants.",
              eventType: "Festival",
            }
          }
        }
      });
      
      // Add a review
      const booking = await prisma.booking.create({
          data: {
              travelerId: traveler.id,
              localFriendId: user.id,
              startTime: new Date(),
              endTime: new Date(),
              totalAmount: 1200,
          }
      });

      await prisma.review.create({
        data: {
          bookingId: booking.id,
          reviewerId: traveler.id,
          revieweeId: user.id,
          rating: 5,
          comment: "Priya showed me a Mumbai I never would have found on my own.",
        }
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
