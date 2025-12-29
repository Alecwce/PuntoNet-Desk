## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2025-12-29 - Redundant API Calls in Routing Logic
**Learning:** Centralized data fetching in `App.tsx` for specific routes can lead to double-fetching if the target views also fetch their own data.
**Action:** Verify if the route component (`TicketList`) actually consumes the data fetched by the parent (`App`) before adding it to the parent's fetch logic.
