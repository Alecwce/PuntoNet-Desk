## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-22 - N+1 Notification Inserts
**Learning:** `createTicket` was using a `forEach` loop to trigger individual `notify` calls for every admin/agent, causing N+1 database inserts and potential connection pool exhaustion.
**Action:** Use `prisma.notification.createMany` to batch inserts. Always look for `forEach` loops with database calls inside.
