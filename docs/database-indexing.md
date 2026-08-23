# Database Indexing Strategy

To ensure scalable performance, MebingLocal employs specific indexing strategies tailored for frequent query paths.

## Key Indexes
1. **Clerk ID (`User.clerkId`)**: Heavy reads during authentication middleware checks.
2. **Location/Status (`LocalPulsePost`)**: For rendering heat maps and feeds based on geographic bounds.
3. **Availability (`Availability.startTime/endTime`)**: Fast overlap queries to prevent double bookings.
4. **Foreign Keys**: B-Tree indexes on heavily joined keys (`Booking.travelerId`, `Booking.localFriendId`).
5. **Enums/Statuses (`Booking.status`, `Report.status`)**: Optimized for filtering active vs completed workflows.
