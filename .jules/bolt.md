## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-12-27 - N+1 Queries in Stats
**Learning:** Dashboard stats were running ~10 separate `COUNT` queries sequentially/parallel.
**Action:** Use `groupBy` to aggregate stats in a single query per table. Be careful to sum *all* groups for totals, not just known enums.
