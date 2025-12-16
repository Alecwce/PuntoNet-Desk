import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../hooks/useDebounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce the value update", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    });

    expect(result.current).toBe("initial");

    // Update the value
    rerender({ value: "updated", delay: 500 });

    // Should still be initial before timer finishes
    expect(result.current).toBe("initial");

    // Fast forward time by 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    // Fast forward time by remaining 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("updated");
  });

  it("should reset timer if value changes within delay", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    });

    rerender({ value: "update1", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Should not have updated yet
    expect(result.current).toBe("initial");

    // Update again before timer finishes
    rerender({ value: "update2", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Should still be initial because timer was reset
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Now it should be update2 (500ms after second update)
    expect(result.current).toBe("update2");
  });
});
