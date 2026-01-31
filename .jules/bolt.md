## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-23 - N+1 Notification Pattern
**Learning:** Found that notifications were being sent in a loop using `forEach`, causing N+1 inserts.
**Action:** Always look for loops calling `notify` and replace with `notifyMany` using `createMany`.
