## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-22 - Batch Notification Optimization
**Learning:** Identified N+1 insertion pattern in `createTicket` where notifications were sent in a loop.
**Action:** Implemented `notifyMany` using `prisma.createMany` to batch operations.
