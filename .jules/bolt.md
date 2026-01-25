## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-22 - N+1 Notification Inserts
**Learning:** `createTicket` was performing N+1 database insertions to notify admins, causing latency proportional to staff count.
**Action:** Replaced sequential `notify()` calls with `notifyMany()` using `prisma.notification.createMany`.
