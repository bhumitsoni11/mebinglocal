import { PrismaClient, UserRole, OnboardingStatus, VerificationStatus, ExperienceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MebingLocal database with realistic Stitch design data...');

  // 1. Clean existing records in safe order
  await prisma.itineraryActivity.deleteMany({});
  await prisma.itineraryDay.deleteMany({});
  await prisma.itinerary.deleteMany({});
  await prisma.aIConversation.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.verificationDocument.deleteMany({});
  await prisma.verificationApplication.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversationParticipant.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.pulsePost.deleteMany({});
  await prisma.savedItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.availabilitySlot.deleteMany({});
  await prisma.experienceImage.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.localProfile.deleteMany({});
  await prisma.travelerProfile.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Destinations
  const tokyo = await prisma.destination.create({
    data: {
      slug: 'tokyo',
      city: 'Tokyo',
      country: 'Japan',
      region: 'Kanto',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbdNKqcTXtu0_Z8HXmrtdhmKj7LrRJUpjO4wc_d9cBsyRzFW4JXQOE4dSQifP5LxMJDsXkvf-kBbO4eQXRSPEBtohClv0GeZ0WQoVsH6THDbS3qtwT-P9AFgUHx7THPIrK5Mtz_NmUbNti4t-2aBE9Kp8UTLFTF0OSQav69YqYKxJOKBNpd2dZfuRaW6xY55uMRdnukGS2mFA-n3mz1GsLnWMEDsyFKql23br6k3_sqJmwzjjYc8fRDg',
      description: 'Where hyper-modern neon alleys blend seamlessly with preserved Edo craft quarters.',
      latitude: 35.6762,
      longitude: 139.6503,
      weatherNote: '21°C · Neon & Heritage',
      avgPrice: 38.00,
      isTrending: true,
      localCount: 210,
    },
  });

  const kyoto = await prisma.destination.create({
    data: {
      slug: 'kyoto',
      city: 'Kyoto',
      country: 'Japan',
      region: 'Kansai',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzaRsfQr5MXpBshN8_Gms710EOSWPNYg8WmoKR0tQYPuVwoqLhCiUtvOHtEkGFgjxQTOsboNcU3sacpOhIcI6ZL6yEXthFlFevdxE-hakvih5raxf1_p-YnZZNODJF5pyqwTO03wRqjGhyOLqU_iPidxzs6IFq5tGF2Z8r0eU1v_g-t-cPb2mci60eMH1ksltikDGbQlS6-3OElyD8ZF9c0_pQeG5gG1RQ7KjcbYtkBszX1Inj7ZjJVQ',
      description: 'Centuries of Zen tea culture, serene temple courtyards, and generational ceramic craft.',
      latitude: 35.0116,
      longitude: 135.7681,
      weatherNote: '18°C · Zen & Crafts',
      avgPrice: 45.00,
      isTrending: true,
      localCount: 145,
    },
  });

  const florence = await prisma.destination.create({
    data: {
      slug: 'florence',
      city: 'Florence',
      country: 'Italy',
      region: 'Tuscany',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxAmTT3p956XF-6zjdCHMcYH6DnVtQIOvXl8AoZCAgWqTVRph6GRBFIZuMFQXNwCY4xkUhoFsuGCO76mDQ-6TKkQrUP9B4u1IsW9oXYZlZoMjCMgjpXSgL8L6UaRlHoTVCKCJ9dnjEj8E3jFGPDvRO9aqipUbNjkdEC0pR3jJ_xYtgGJ6oCo1hJDNpQxp6mADk7ZiQar0OTNbT_s6Bg_MFtRYWXh6Er5PAkuz0Xof1_WpFvVTZoLpvQA',
      description: 'Sun-drenched terracotta streets, artisan leather botteghe, and family wine cellars in Oltrarno.',
      latitude: 43.7696,
      longitude: 11.2558,
      weatherNote: '22°C · Renaissance Soul',
      avgPrice: 35.00,
      isTrending: true,
      localCount: 180,
    },
  });

  const cdmx = await prisma.destination.create({
    data: {
      slug: 'mexico-city',
      city: 'Mexico City',
      country: 'Mexico',
      region: 'CDMX',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhjYJoQpVJNtdUGWVY67D9V_aRaaUbkAlNOMVqWqU8i8-6bmwMOgKGW1FEk1Vofq1WrLZrGBeYRLUKJyTpfheQhRGWtYOdPZqZGY8AWEV_FFcfU0nRO-dUmkazYq5zTUzP3hKIqYSz1sH35z1wmFBP2UdLLSAFgokTLhvyQ9lc2K7eEKWSbChkjjfxFSWBORMzavN2dHINWct_keRJFGJT66xt48zIMZl4H8vTtmLt6SVhTW2E6utjDg',
      description: 'Culinary capitals, vibrant jacaranda streets of Roma Norte, and historic cantinas in Coyoacán.',
      latitude: 19.4326,
      longitude: -99.1332,
      weatherNote: '24°C · Culinary Soul',
      avgPrice: 28.00,
      isTrending: true,
      localCount: 180,
    },
  });

  const lisbon = await prisma.destination.create({
    data: {
      slug: 'lisbon',
      city: 'Lisbon',
      country: 'Portugal',
      region: 'Estremadura',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzY-m3ALG7wm7gyl4Zrig-_aEY-dVO7bAWGGryCyLZss5gK4PnCXqSqiuAI5oiOFVpUh08uIsV2hp6ye4Xx6XhkVefy45WQDymOJJwnn5zPJ-JdNRmLR7wFJrJIiAPVqf_63Vsw-APmKwp8sQjDIykxDHxsywk7WIu-DT3zlONETzZCy8TX_tAhIM9CpTSrEBzIhm-vWHcePs4nmhSqhr4WOfusiFvcNzoQpeTZBupksxXQv0zrRkl8A',
      description: 'Golden Atlantic breezes, vintage Alfama trams, and bohemian azulejo tile courtyards.',
      latitude: 38.7223,
      longitude: -9.1393,
      weatherNote: '22°C · Coastal Bohemia',
      avgPrice: 32.00,
      isTrending: true,
      localCount: 160,
    },
  });

  const paris = await prisma.destination.create({
    data: {
      slug: 'paris',
      city: 'Paris',
      country: 'France',
      region: 'Île-de-France',
      heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&fit=crop&q=80',
      description: 'Canal Saint-Martin jazz bars, secret Belleville artist ateliers, and local flea markets.',
      latitude: 48.8566,
      longitude: 2.3522,
      weatherNote: '17°C · Historic Bohemian',
      avgPrice: 38.00,
      isTrending: true,
      localCount: 195,
    },
  });

  // 3. Admin User
  const adminUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_admin_stitch_001',
      email: 'admin@mebinglocal.com',
      name: 'MebingLocal Operations',
      role: UserRole.SUPER_ADMIN,
      onboardingStatus: OnboardingStatus.COMPLETED,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80',
    },
  });

  // 4. Local Friends
  // Host 1: Elena Rossi (Florence)
  const elenaUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_elena_florence_001',
      email: 'elena.rossi@mebinglocal.test',
      name: 'Elena Rossi',
      role: UserRole.LOCAL_FRIEND,
      onboardingStatus: OnboardingStatus.COMPLETED,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC01zPXzIKGzm7sn1XNsHYDkjcrHeiVpfUxzqP1t2LXby_oTTPaTYekLjOi0Ojqd-jIA6C530l_wi73snHfrA39XYourpLv_XJRBfSsjTkSw6sfxybFf2_w38498jBl6Tp0Dpy23aemyAQv6g-tQ0JeCDFLZAvaRhDz90rNFfO8_dchE3JPvJQ0iT6rWQqQGRkww0ePLFNXIzpPOjxHIrUcNFKCNB0d6uE7nQEugjV76TRqoQfmZ2qG5Q',
    },
  });

  const elenaProfile = await prisma.localProfile.create({
    data: {
      userId: elenaUser.id,
      destinationId: florence.id,
      city: 'Florence',
      country: 'Italy',
      tagline: 'Architect & Wine Enthusiast',
      bio: 'Architect & wine enthusiast sharing hidden artisan quarters, marbled paper workshops, and secret Renaissance courtyards in Oltrarno.',
      hourlyRate: 35.00,
      languages: ['Italian', 'English'],
      interests: ['Architecture', 'Natural Wine', 'Artisan Crafts', 'Renaissance History'],
      expertise: ['Oltrarno Heritage', 'Wine Tasting', 'Historic Ateliers'],
      yearsResident: 12,
      responseTimeMin: 8,
      responseRatePct: 100,
      ratingScore: 4.98,
      reviewCount: 124,
      isSuperhost: true,
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  // Host 2: Kenji Tanaka (Tokyo)
  const kenjiUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_kenji_tokyo_001',
      email: 'kenji.tanaka@mebinglocal.test',
      name: 'Kenji Tanaka',
      role: UserRole.LOCAL_FRIEND,
      onboardingStatus: OnboardingStatus.COMPLETED,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqfU5FIabnja1SwcN3cXbWR69mESaI9Zgpe-PrdyVDRQhyTvlR0JMuxEHnU34s-537bZnr1RV-YqqlMqgLIPWYt_vrF6IlDuMP3pmCaLIoPp-iICBrXe4A9fB_DCO0U8fuuc8MW9xPLkOmoJICvUFSOMbtEfrAUS5qwHzCNPTzvs8_RakwWALP2D51pBEItW6QHo2rSiIsr4yGvYQdJDpm0ub-kZUQCh-ccn6_LBzvlWwLKBqOVkOxCw',
    },
  });

  const kenjiProfile = await prisma.localProfile.create({
    data: {
      userId: kenjiUser.id,
      destinationId: tokyo.id,
      city: 'Tokyo',
      country: 'Japan',
      tagline: 'Photographer & Culinary Storyteller',
      bio: 'Photographer & culinary storyteller guiding through Yanaka low-city alleys, Tsukiji market blacksmiths, and vintage kissaten cafes.',
      hourlyRate: 42.00,
      languages: ['Japanese', 'English'],
      interests: ['Street Photography', 'Coffee Craft', 'Traditional Blacksmithing', 'Izakaya'],
      expertise: ['Yanaka Low-City', 'Tsukiji Outer Market', 'Vintage 35mm Photo Walks'],
      yearsResident: 19,
      responseTimeMin: 5,
      responseRatePct: 100,
      ratingScore: 5.0,
      reviewCount: 210,
      isSuperhost: true,
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  // Host 3: Camila Morales (Mexico City)
  const camilaUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_camila_cdmx_001',
      email: 'camila.morales@mebinglocal.test',
      name: 'Camila Morales',
      role: UserRole.LOCAL_FRIEND,
      onboardingStatus: OnboardingStatus.COMPLETED,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABhSmY-Q8fI-jv7P4Dpk390MsFHFMBDGbXNqiARlGOuX8-XSXEyt_F3cC9qMOWr2WfCQTwfvR02hvZEn7jUeYDLKqK3jMapjuKerRHVFEZHtRYm0y3M1omKRVrUFYKRSXbL5pUe3Tuikmg26Jfq_UAWe-gdbbqTsRSdhnYwWLwdPqGxArF6eexHi0_scipFqJHf3qK9dEX2NxJc2r61zwDWl5JahXVec4r75KGUBpeiaxfyMQQSseBBw',
    },
  });

  const camilaProfile = await prisma.localProfile.create({
    data: {
      userId: camilaUser.id,
      destinationId: cdmx.id,
      city: 'Mexico City',
      country: 'Mexico',
      tagline: 'Contemporary Curator & Street Food Historian',
      bio: 'Contemporary curator & street food historian celebrating traditional culinary roots in Roma, Condesa, and Coyoacán cantinas.',
      hourlyRate: 30.00,
      languages: ['Spanish', 'English', 'French'],
      interests: ['Contemporary Art', 'Wild Agave Mezcal', 'Pre-Hispanic Gastronomy', 'Architecture'],
      expertise: ['Coyoacán Cantinas', 'Roma Norte Art Galleries', 'Oaxacan Markets'],
      yearsResident: 8,
      responseTimeMin: 12,
      responseRatePct: 98,
      ratingScore: 4.96,
      reviewCount: 88,
      isSuperhost: false,
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  // Host 4: Amara Diallo (Paris)
  const amaraUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_amara_paris_001',
      email: 'amara.diallo@mebinglocal.test',
      name: 'Amara Diallo',
      role: UserRole.LOCAL_FRIEND,
      onboardingStatus: OnboardingStatus.COMPLETED,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM8Ozdzv6vZLQSiC435raTzoRR1w7h8t_M5fpSWDhwOMccBC3CLDEdIAd75EYfHh4g9wPz86YvK_Fq_zlUB_UGWze5pyrYvzSo-t_5bVbzlb3Na6Ej-tTXWbogmn4cfklC6MrsRVUK4UBfDlJWsaqXiucxAjmr19gJuAewlYwVMnUXaGeWe44a-59yNFS-JKyMEBCCIqCzAYtqAahKVle7aITzPC5WhPrLft8yS2QYwPT72tIc51LX5A',
    },
  });

  const amaraProfile = await prisma.localProfile.create({
    data: {
      userId: amaraUser.id,
      destinationId: paris.id,
      city: 'Paris',
      country: 'France',
      tagline: 'Jazz Musician & Flea Market Hunter',
      bio: 'Jazz musician & flea market hunter uncovering the soul of Belleville and bohemian Canal Saint-Martin vintage bistros.',
      hourlyRate: 38.00,
      languages: ['French', 'English'],
      interests: ['Live Jazz', 'Vintage Vinyl', 'Bistronomy', 'Canal Saint-Martin'],
      expertise: ['Belleville Hidden Studios', 'Les Puces Flea Markets', 'Secret Jazz Basements'],
      yearsResident: 15,
      responseTimeMin: 10,
      responseRatePct: 100,
      ratingScore: 4.99,
      reviewCount: 156,
      isSuperhost: true,
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  // Host 5: Satoshi Mori (Kyoto)
  const satoshiUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_satoshi_kyoto_001',
      email: 'satoshi.mori@mebinglocal.test',
      name: 'Satoshi Mori',
      role: UserRole.LOCAL_FRIEND,
      onboardingStatus: OnboardingStatus.COMPLETED,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFMerRDbJLDV-wwGfj9QOAY0wKJmAzIgFWn46UioYG5vmkw_KWEE9Yhv8aSO4kTFfbb67kq4xZemlwCshbhLNaFxXYlNSNgXnwTm8TtPnffaAse2tYjPrvmX-T1rz5ZHzw4QLReZ2M-YIGjbYnWUd4yxpTRz-Oquh1aZMTk9yVWlcki2J6TZawP_LJ7HaxubsVVi8zi1iiLE6KRHMiJYZYdBt3JeuD8_br0vvujeqiLe1umKGs58GceQ',
    },
  });

  const satoshiProfile = await prisma.localProfile.create({
    data: {
      userId: satoshiUser.id,
      destinationId: kyoto.id,
      city: 'Kyoto',
      country: 'Japan',
      tagline: '5th Generation Kiyomizu Potter',
      bio: '5th generation Kiyomizu ceramist hosting intimate clay glazing, tranquil Uji tea ceremonies, and private machiya visits.',
      hourlyRate: 50.00,
      languages: ['Japanese', 'English'],
      interests: ['Ceramic Glazing', 'Matcha Way of Tea', 'Zen Philosophy', 'Kyoto Machiya'],
      expertise: ['Kiyomizu-yaki Ceramics', 'Uji Tea Farms', 'Zen Garden Meditation'],
      yearsResident: 34,
      responseTimeMin: 15,
      responseRatePct: 100,
      ratingScore: 5.0,
      reviewCount: 178,
      isSuperhost: true,
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  // 5. Curated Experiences
  // Exp 1: Kenji's Tsukiji Tour
  const exp1 = await prisma.experience.create({
    data: {
      localProfileId: kenjiProfile.id,
      destinationId: tokyo.id,
      title: 'Dawn Tsukiji Market Tasting & Knife Artisan Visit',
      description: 'Savor fresh seasonal sashimi, taste century-old tamagoyaki recipes, and meet master blacksmiths forging Sakai knives.',
      category: 'Food & Culinary',
      durationHours: 4.5,
      maxGuests: 4,
      pricePerPerson: 75.00,
      meetingPoint: 'Tsukiji Hongan-ji Temple Main Gate',
      inclusions: ['All market tastings (6 courses)', 'Matcha & Tamagoyaki', 'Private artisan workshop access'],
      requirements: ['Comfortable walking shoes', 'Appetite for seafood'],
      languages: ['English', 'Japanese'],
      status: ExperienceStatus.PUBLISHED,
      isInstantBook: true,
      isFeatured: true,
      ratingScore: 5.0,
      reviewCount: 94,
    },
  });

  await prisma.experienceImage.create({
    data: {
      experienceId: exp1.id,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpNy4sRLakyeusP8XSflVVk3yTomGYzW5wspQAiOPGT_ZKlDBeZ0Cdr6NajbfVtnUTD81YhaKq4WR66rCPNvivIRZUeDBHu0CbPH7LBbMLAsLHK-B9Do0QJfQuH8gUt6tW8m7sw5n74Q78pjgvq_k9V7QL0-wkA0sluqA8VgGOoAPb61bmFbpWYyvPHpv73h8WcA1BLgUi5zzQr8JL7mKaEksSYGdm4-J3llHr6IAoVO0oS_4QrCckww',
      caption: 'Japanese knife artisan sharpening forged steel blade',
      displayOrder: 1,
    },
  });

  // Exp 2: Elena's Florence Tour
  const exp2 = await prisma.experience.create({
    data: {
      localProfileId: elenaProfile.id,
      destinationId: florence.id,
      title: 'Twilight Natural Wine & Historic Botteghe Walk',
      description: 'Bypass tourist crowds into Oltrarno centuries-old leather and marbled paper ateliers, concluding at a family buchetta del vino.',
      category: 'Wine & Art',
      durationHours: 3.0,
      maxGuests: 4,
      pricePerPerson: 55.00,
      meetingPoint: 'Piazza Santo Spirito Fountain',
      inclusions: ['3 glasses of organic Tuscan natural wine', 'Pecorino & crostini pairings', 'Private atelier visits'],
      requirements: ['21+ for wine tasting', 'Casual comfortable attire'],
      languages: ['English', 'Italian'],
      status: ExperienceStatus.PUBLISHED,
      isInstantBook: true,
      isFeatured: true,
      ratingScore: 4.98,
      reviewCount: 62,
    },
  });

  await prisma.experienceImage.create({
    data: {
      experienceId: exp2.id,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATnWefKAqgXmxfmBo8D5Q2ent2Y7-9-3Mhqv3ZCGKt51s6qbvKYiteLP5k4bQwjdzfA7wBmkih8V3kiA2Jlmeg0INeMCSS8CosyITZ18Fu6svoj_H3j1phzfVGJkYEw8capAR5PqEJhwXfgrbvWuJzyPe806HCpUiIcWl4OLz8e5c6PoRqZkxztfRHsRBUMMZ00U6kUrOLzSWqt_ExLmHuPha8zX5LwQnH7nEi0hP7sYMzewD_GPk9Aw',
      caption: 'Rustic Florentine wine cellar in Oltrarno',
      displayOrder: 1,
    },
  });

  // Exp 3: Camila's Mezcal Tour
  const exp3 = await prisma.experience.create({
    data: {
      localProfileId: camilaProfile.id,
      destinationId: cdmx.id,
      title: 'Secret Cantinas & Mezcal Pairing in Coyoacán',
      description: 'Explore Oaxaca wild agaves, slow-cooked carnitas, and Frida Kahlo neighborhood lore with an art historian guide.',
      category: 'Culinary & History',
      durationHours: 3.5,
      maxGuests: 5,
      pricePerPerson: 48.00,
      meetingPoint: 'Jardín Hidalgo Kiosk, Coyoacán',
      inclusions: ['4 single-origin wild agave mezcals', 'Traditional botanas & tacos', 'Historic neighborhood walk'],
      requirements: ['18+ for mezcal tastings'],
      languages: ['English', 'Spanish'],
      status: ExperienceStatus.PUBLISHED,
      isInstantBook: true,
      isFeatured: true,
      ratingScore: 4.97,
      reviewCount: 45,
    },
  });

  await prisma.experienceImage.create({
    data: {
      experienceId: exp3.id,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzSAkHPPkEAnYaF4z8EumXnl-Jbpa1DfFQns-6mnBFgnMJyo520xuOxqd8yw2zhRTbomEFGBluv6uo5IR7cXzeCrKQPN2i7h_BfCMP2mquCF4Zoh7IaVnA9G6xrMb7Nx9UavoqDxz0_qYrsQroWM_1r56nY-TMsaELHLHzbCiD_xfvNvfgmVdclo1k9Y9FqkYfiohWNvN0wDlSnM9B-hhd1UV25EzfnWzw3rJjwWMbNKb0N8QCb2ySxA',
      caption: 'Artisanal clay copitas of wild mezcal in Coyoacán',
      displayOrder: 1,
    },
  });

  // 6. Pulse Posts (Real-time community wire)
  await prisma.pulsePost.create({
    data: {
      localProfileId: kenjiProfile.id,
      destinationId: tokyo.id,
      vibeCategory: 'food',
      title: 'Kikumi Senbei 70-Year Coals',
      content: 'Square soy sauce crackers hand-flipped over binchotan coals since 1940. Order the sansho pepper batch fresh at 10 AM.',
      spotName: 'Kikumi Senbei',
      spotAddress: 'Yanaka Ginza Alley, Tokyo',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEcXu2tHf9gkTFtZ2hY017lEoZfVGrv27i-kdWKj4XrE5Z_g5xkieWXbeNqN3ooy5cn_bP44a3ivTpbpGzcJsPfeTZU1MlQgZIDhVv3Y_4pNqFYWlS_AmdJx8OhrMkubbn2T4pjcgcPWGY93iy5hIK0Qr0c_KTKZbxrnQe3uiugFS3F4Nj3-nlP2yswitPgl5YIiYEEDwimmo0Cv4Va442ORor5P7EHwyULCh9FNlUov7AO0ej__iRqw',
      upvotesCount: 42,
    },
  });

  await prisma.pulsePost.create({
    data: {
      localProfileId: kenjiProfile.id,
      destinationId: tokyo.id,
      vibeCategory: 'food',
      title: 'Kayaba Coffee Tatami Corner',
      content: 'Built in 1916. Sip matcha lattes seated on tatami straw mats beneath warm raw timber joists.',
      spotName: 'Kayaba Coffee',
      spotAddress: 'Near Nezu Shrine, Yanaka',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgJE9hFGEabWspiwtF-nji3EB387chwmsJWxAjIamULduKAYp09ucdt9tPFWcTHkuYvcRtyjaeihLrJxAWj181oUpvJTwv3cwuAaDXZ3l3alvS2nDb9_JbAAQVW2SYPsuVw7NcW5N6UL64g1bR8owSQgr2_yMRj8IwAOrvk_JdPy6FAzqI493Mq2ZfWmPxEcZB9S5VpuKMRdIWGq4NNj-5pFKorCHC1OzcDHUrXrCXwBsYCKB1o-lw9w',
      upvotesCount: 38,
    },
  });

  console.log('✅ Seed completed successfully with realistic MebingLocal records!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
