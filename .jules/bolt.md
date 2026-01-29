## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-23 - Backend Payload Optimization
**Learning:** Prisma's 'include: true' fetches ALL fields including sensitive ones. Using 'select' significantly reduces payload and improves security.
**Action:** Use a reusable 'userSafeSelect' object for all User relation queries.
