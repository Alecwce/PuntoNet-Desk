## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2025-02-23 - Dashboard Performance
**Learning:** The Dashboard and Reports heavily rely on `createdAt` sorting and filtering, but the `Ticket` model lacked an index on this field, causing likely full table scans for "Recent Tickets" and report date range queries.
**Action:** Added `@@index([createdAt])` to `Ticket` model.
