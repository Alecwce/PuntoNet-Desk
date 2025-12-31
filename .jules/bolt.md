## 2024-05-22 - Missing Database Indexes
**Learning:** Found critical foreign keys and status fields used in WHERE clauses without indexes.
**Action:** Always check schema.prisma against controller queries.

## 2024-05-22 - Memoization of Static Navigation
**Learning:** `Sidebar` component was re-rendering on every parent update, despite having static content (or content dependent only on props).
**Action:** Use `React.memo` for static layout components like Sidebar/Header to prevent render cascading. Ensure tests pass `user` props explicitly instead of relying on `localStorage` side effects.
