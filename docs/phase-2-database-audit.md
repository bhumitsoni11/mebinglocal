# Phase 2 Database Audit Report

## 1. Existing Prisma Schema (`schema.prisma`)
- **Current State**: An initial scaffolded `schema.prisma` file exists with 313 lines.
- **Roles**: Contains a `Role` enum with `ADMIN`, `TRAVELER`, and `COMPANION`. The prompt requires using `LOCAL_FRIEND` instead of `COMPANION`.
- **User Models**: 
  - Main `User` model maps to Clerk (`clerkId` unique).
  - Profiles are currently named `TravelerProfile` and `CompanionProfile` (needs to be renamed to `LocalFriendProfile`).
- **Missing Architecture**:
  - **Interests**: `TravelerProfile` uses a generic `preferences Json?`. Needs a proper normalized relational structure (e.g. Many-to-Many `Interest` model).
  - **Languages**: Stored as `String[]` arrays in profiles instead of a normalized relational structure.
  - **Experiences**: Currently missing completely. The booking model maps directly between Traveler and Companion, but the business logic requires an optional Experience attached to a Booking.
  - **Availability**: Missing. There is only an `isAvailable` boolean, but no date/time ranges to prevent double-booking.
  - **Payments**: Exists minimally with `status` as a String instead of an Enum. Missing detailed commission and platform fee breakdowns.
  - **Verification**: `VerificationDocument` exists but lacks full state-machine workflows (e.g. rejection reasons, reviewer IDs).
  - **Local Pulse**: `LocalPulsePost`, `Event`, and `EventMedia` exist but lack some necessary fields for AI processing status, crowd density structure, and moderation states.
  - **Safety/Reports**: Has `EmergencyContact` and `SOSRequest`, but missing a generalized `Report` model for moderation.
  - **AI Features**: Has `AITrip`, but needs expansion for AI Match requests and AI review summaries.

## 2. NestJS Backend Structure
- **Modules**: The `src/modules/` directory contains scaffolded module folders for `ai`, `auth`, `bookings`, `chat`, `companions`, `maps`, `notifications`, `payments`, `reviews`, `trips`, `users`.
- **Usage**: A search for `CompanionProfile` across `src` yielded 0 results, meaning the generated Prisma client types are not yet heavily ingrained into the NestJS business logic. Renaming to `LocalFriend` will not cause massive refactoring overhead.

## 3. Migrations & Database State
- **Migrations**: The `prisma/migrations` folder does not exist. 
- **Database Connection**: Configured to use Supabase PostgreSQL (`DATABASE_URL` and `DIRECT_URL` present in `.env`).

## 4. Required Changes for Phase 2
- Rename all `Companion` references to `LocalFriend` (Enum, Models, Relations).
- Introduce normalized `Interest` and `Language` models with many-to-many junction tables.
- Introduce `Experience` model owned by `LocalFriend`.
- Add robust `Availability` and `BookingConflict` tracking architecture.
- Expand the `Booking` model to reference an `Experience` optionally and track detailed state transitions with a `BookingStatus` enum.
- Expand `Payment` to include `platformCommission`, `localFriendAmount`, and `netAmount`.
- Implement `Report` and `AuditLog` models for Trust & Safety and Admin interventions.
- Ensure proper unique constraints and foreign key actions (e.g., `onDelete: Cascade` vs `Restrict`).
- Configure appropriate indexes on query-heavy paths (Clerk ID, location/status, dates).
