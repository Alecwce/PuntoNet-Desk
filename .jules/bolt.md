## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-23 - N+1 Notification Inserts
**Learning:** `notify()` helper performs a single INSERT. Usage in loops (like broadcasting to staff) causes N+1 issues.
**Action:** Use `notifyMany()` with `createMany` for broadcasting events.
