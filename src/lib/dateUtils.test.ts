import { describe, it, expect } from "vitest";
import { formatRelativeDate } from "./dateUtils";
import { es } from "date-fns/locale";

describe("formatRelativeDate", () => {
  it("should format a valid date string correctly", () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
    const result = formatRelativeDate(pastDate.toISOString());
    expect(result).toMatch(/hora/); // Depends on locale, roughly
  });

  it("should format a valid Date object correctly", () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 1000 * 60 * 5); // 5 minutes ago
    const result = formatRelativeDate(pastDate);
    expect(result).toContain("hace 5 minutos");
  });

  it('should return "Fecha inválida" for invalid dates', () => {
    const result = formatRelativeDate("invalid-date-string");
    expect(result).toBe("Fecha inválida");
  });
});
