# Data Model

The data model for MebingLocal is strictly relational and designed using Prisma Schema Language (`schema.prisma`).

## Major Modules
- **Identity**: `User`
- **Profiles**: `TravelerProfile`, `LocalFriendProfile`
- **Taxonomies**: `Interest`, `Language` (normalized with junction tables)
- **Marketplace**: `Experience`, `Availability`
- **Transactions**: `Booking`, `Payment`
- **Interactions**: `Review`, `Chat`, `Message`
- **Social/Discovery**: `LocalPulsePost`, `Event`, `EventMedia`
- **Safety & Moderation**: `Report`, `EmergencyContact`, `SOSRequest`, `AuditLog`, `ActivityLog`, `VerificationDocument`
- **AI Core**: `AITrip`, `AIMatchRequest`, `AITrustSignal`

For full relational layouts, see `prisma/schema.prisma` in the backend repository.
