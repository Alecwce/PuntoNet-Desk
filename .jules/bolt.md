## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-22 - Batch Insert Notifications
**Learning:** Found N+1 query pattern in `createTicket` where `notify()` was called in a loop.
**Action:** Implemented `notifyMany` using `prisma.notification.createMany` to batch inserts. Always look for loops calling DB operations.
