## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-23 - Prisma Include Security
**Learning:** Using `include: { relation: true }` in Prisma exposes all fields, including sensitive ones like `password` or `twoFactorSecret`.
**Action:** Always use `include: { relation: { select: { ... } } }` to fetch only necessary fields and reduce payload size.
