import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Login } from "../../views/Login";
import { BrowserRouter } from "react-router-dom";

// Mock Icon component to avoid issues
vi.mock("../../components/Icon", () => ({
  Icon: ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`}>{name}</span>
  ),
}));

// Mock API
const mockPost = vi.fn();
vi.mock("../../lib/api", () => ({
  default: {
    post: (...args: any[]) => mockPost(...args),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onLoginMock = vi.fn();

  it("renders login form", () => {
    render(
      <BrowserRouter>
        <Login onLogin={onLoginMock} />
      </BrowserRouter>
    );
    expect(
      screen.getByPlaceholderText(/usuario@puntonet.com/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it("handles user input", () => {
    render(
      <BrowserRouter>
        <Login onLogin={onLoginMock} />
      </BrowserRouter>
    );
    const emailInput = screen.getByPlaceholderText(/usuario@puntonet.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("shows error on failed login", async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <BrowserRouter>
        <Login onLogin={onLoginMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Entrar/i));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("calls onLogin on success", async () => {
    mockPost.mockResolvedValueOnce({
      data: { user: { id: 1, name: "Test User" }, require2fa: false },
    });

    render(
      <BrowserRouter>
        <Login onLogin={onLoginMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Entrar/i));

    await waitFor(() => {
      expect(onLoginMock).toHaveBeenCalled();
    });
  });
});
