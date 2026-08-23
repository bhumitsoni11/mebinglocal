# Database Security

## Access Architecture
MebingLocal follows a strictly managed backend security architecture:
1. **Frontend**: Cannot execute raw SQL or arbitrary Prisma queries.
2. **API (NestJS)**: Enforces business logic and Row Level Security equivalents in application logic.
3. **ORM (Prisma)**: Manages query construction safely.

## Financial & Sensitive Data
- Payments are stored with Razorpay references (`razorpayOrderId`). No raw card data is stored.
- Soft deletes are used for `User` to anonymize but retain structural integrity of financial/booking logs.
