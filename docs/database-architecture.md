# Database Architecture

## Overview
MebingLocal uses a normalized PostgreSQL relational database managed via Prisma ORM. 

## Entities & Relationships
- **User**: The core identity mapped to Clerk via `clerkId`. Uses soft deletion (`deletedAt`) to preserve integrity.
- **Profiles**: Split into `TravelerProfile` and `LocalFriendProfile`, maintaining a strict separation of concerns.
- **Normalized Interests/Languages**: Many-to-many junction tables (`TravelerInterest`, `LocalFriendInterest`, etc.) map users to centralized `Interest` and `Language` taxonomies.
- **Experience**: Owned by `LocalFriendProfile`, representing a bookable tour or activity.
- **Booking**: Central entity linking `Traveler`, `LocalFriend`, and an optional `Experience`. Contains status workflows.
- **Payment**: Handles financial records, splitting `amount` (gross) into `platformCommission` and `localFriendAmount`. Uses minor units (cents).
- **Local Pulse**: Post entity containing `status`, AI `processingStatus`, and relational media/events.
- **Safety**: Robust models for `EmergencyContact`, `SOSRequest`, and `Report` workflows.
