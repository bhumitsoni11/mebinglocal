import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { LocalsModule } from './modules/locals/locals.module';
import { TravelersModule } from './modules/travelers/travelers.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PulseModule } from './modules/pulse/pulse.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { VerificationModule } from './modules/verification/verification.module';
import { AIModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DestinationsModule,
    LocalsModule,
    TravelersModule,
    ExperiencesModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    PulseModule,
    ChatModule,
    NotificationsModule,
    VerificationModule,
    AIModule,
    AdminModule,
  ],
})
export class AppModule {}
