## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-23 - Prisma Over-fetching
**Learning:** Using `include: { relation: true }` fetches ALL fields, including sensitive ones (passwords, 2FA secrets).
**Action:** Always use `include: { relation: { select: userSafeSelect } }` to whitelist public fields only.
