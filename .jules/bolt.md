## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-24 - N+1 in Dashboard Stats
**Learning:** Found multiple parallel COUNT queries for each status/role in `getDashboardStats`, causing unnecessary DB roundtrips.
**Action:** Use `prisma.groupBy` to aggregate counts in a single query.
