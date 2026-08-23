# Booking State Machine

## Statuses
- **PENDING**: Booking created, waiting for Local Friend approval.
- **CONFIRMED**: Local Friend accepted, payment authorized.
- **REJECTED**: Local Friend declined the booking request.
- **CANCELLED**: Traveler or Local Friend cancelled after confirmation.
- **COMPLETED**: The experience occurred successfully.
- **REFUNDED**: Post-cancellation or dispute resolution.

## Valid Transitions
- `PENDING` -> `CONFIRMED` | `REJECTED` | `CANCELLED`
- `CONFIRMED` -> `COMPLETED` | `CANCELLED`
- `CANCELLED` -> `REFUNDED`
