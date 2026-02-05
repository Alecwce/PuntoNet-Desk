## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2026-02-05 - Sequential Notification Inserts
**Learning:** Found N+1 insert pattern in notification logic where loops called single `create` operations.
**Action:** Prefer `createMany` for batch operations like broadcasting notifications.
