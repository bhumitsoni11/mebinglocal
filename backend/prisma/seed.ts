import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Users
  await prisma.user.upsert({
    where: { email: 'traveler@example.com' },
    update: {},
    create: {
      clerkId: 'user_2m1234567890',
      email: 'traveler@example.com',
      firstName: 'Alice',
      lastName: 'Wander',
      role: Role.TRAVELER,
      travelerProfile: {
        create: {
          bio: 'I love exploring new cultures.',
          budgetLevel: 'MODERATE',
        },
      },
    },
  });

  const localFriend = await prisma.user.upsert({
    where: { email: 'localfriend@example.com' },
    update: {},
    create: {
      clerkId: 'user_2m9876543210',
      email: 'localfriend@example.com',
      firstName: 'Bob',
      lastName: 'Guide',
      role: Role.LOCAL_FRIEND,
      localFriendProfile: {
        create: {
          bio: 'Native New Yorker, love sharing the hidden spots.',
          hourlyRate: 5000, // $50.00
          location: 'New York, NY',
          isVerified: true,
          rating: 4.8,
          totalReviews: 12,
        },
      },
    },
  });

  // Create Taxonomies
  const interestFood = await prisma.interest.upsert({
    where: { name: 'Food' },
    update: {},
    create: { name: 'Food', description: 'Culinary experiences' },
  });

  await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English' },
  });

  // Link Taxonomies
  const localFriendProfile = await prisma.localFriendProfile.findUnique({
    where: { userId: localFriend.id },
  });

  if (localFriendProfile) {
    await prisma.localFriendInterest.upsert({
      where: {
        localFriendId_interestId: {
          localFriendId: localFriendProfile.id,
          interestId: interestFood.id,
        },
      },
      update: {},
      create: {
        localFriendId: localFriendProfile.id,
        interestId: interestFood.id,
      },
    });

    // Create Experience
    await prisma.experience.create({
      data: {
        localFriendId: localFriendProfile.id,
        title: 'Hidden Food Gems of NYC',
        description: 'Taste the best pizza and bagels.',
        category: 'Food',
        location: 'Lower Manhattan',
        durationMinutes: 180,
        price: 7500, // $75.00
      },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
