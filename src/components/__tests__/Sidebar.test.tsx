import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../Sidebar";
import { BrowserRouter } from "react-router-dom";
import { User } from "../../types";

// Mock Icon
vi.mock("../Icon", () => ({
  Icon: ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`}>{name}</span>
  ),
}));

const mockNavigate = vi.fn();
const mockLocation = { pathname: "/dashboard" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onLogoutMock = vi.fn();

  // Helper to create mock users
  const createMockUser = (role: "ADMIN" | "AGENT" | "CLIENT"): User => ({
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isTwoFactorEnabled: false
  });

  it("renders structure even if user is null (though items might be hidden)", () => {
    render(
      <BrowserRouter>
        <Sidebar user={null} onLogout={onLogoutMock} />
      </BrowserRouter>
    );
    expect(screen.getByText("PuntoNet")).toBeInTheDocument();
  });

  it("renders menu items for ADMIN", () => {
    const user = createMockUser("ADMIN");
    render(
      <BrowserRouter>
        <Sidebar user={user} onLogout={onLogoutMock} />
      </BrowserRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Reportes")).toBeInTheDocument(); // Admin only
  });

  it("renders menu items for CLIENT", () => {
    const user = createMockUser("CLIENT");
    render(
      <BrowserRouter>
        <Sidebar user={user} onLogout={onLogoutMock} />
      </BrowserRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Reportes")).not.toBeInTheDocument(); // Admin only
  });

  it("navigates on click", () => {
    const user = createMockUser("ADMIN");
    render(
      <BrowserRouter>
        <Sidebar user={user} onLogout={onLogoutMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Gestión de Tickets"));
    expect(mockNavigate).toHaveBeenCalledWith("/tickets");
  });

  it("calls onLogout", () => {
    const user = createMockUser("ADMIN");
    render(
      <BrowserRouter>
        <Sidebar user={user} onLogout={onLogoutMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(onLogoutMock).toHaveBeenCalled();
  });
});
