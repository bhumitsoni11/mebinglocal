import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './common/database/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompanionsModule } from './modules/companions/companions.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ChatModule } from './modules/chat/chat.module';
import { TripsModule } from './modules/trips/trips.module';
import { AiModule } from './modules/ai/ai.module';
import { MapsModule } from './modules/maps/maps.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TravelersModule } from './modules/travelers/travelers.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { LocalPulseModule } from './modules/local-pulse/local-pulse.module';
import { ReportsModule } from './modules/reports/reports.module';
import { OpenaiModule } from './modules/openai/openai.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule, AuthModule, UsersModule, CompanionsModule, BookingsModule, ReviewsModule, ChatModule, TripsModule, AiModule, MapsModule, PaymentsModule, NotificationsModule, TravelersModule, ExperiencesModule, AvailabilityModule, LocalPulseModule, ReportsModule, OpenaiModule, RedisModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
