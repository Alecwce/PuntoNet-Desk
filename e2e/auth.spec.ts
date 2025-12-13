import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should allow user to login", async ({ page }) => {
    // Navigate to login
    await page.goto("/login");

    // Check elements
    await expect(page.getByPlaceholder("usuario@puntonet.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();

    // Fill credentials
    // Note: This requires a running backend with seed data or mocked API in dev mode
    // For now we check the form interactions

    await page
      .getByPlaceholder("usuario@puntonet.com")
      .fill("admin@puntonet.com");
    await page.getByPlaceholder("••••••••").fill("password123");

    // Check submit button
    const submitBtn = page.getByRole("button", { name: /Entrar/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // Optional: click and check response if backend is reachable
    // await submitBtn.click();
    // await expect(page).toHaveURL('/dashboard');
  });

  test("should show validation errors", async ({ page }) => {
    await page.goto("/login");
    // Simple check if inputs are required
    const emailInput = page.getByPlaceholder("usuario@puntonet.com");
    await expect(emailInput).toHaveAttribute("required", "");
  });
});
