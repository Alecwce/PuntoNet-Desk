## 2024-05-23 - [Frontend] - Playwright Route Interception Specificity
**Learning:** When using Playwright `page.route` to mock API responses in a Single Page Application (SPA), using generic wildcards like `**/tickets*` can inadvertently intercept the frontend's own navigation requests (e.g., `http://localhost:5173/tickets`) if the route paths are similar.
**Action:** Always verify the `api` configuration (e.g., `baseURL`) and use specific patterns for mocks, such as `**/api/tickets*`, to distinguish between XHR/Fetch requests to the backend and browser navigation to frontend routes.
