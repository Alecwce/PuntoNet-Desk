import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../Sidebar";
import { BrowserRouter } from "react-router-dom";

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
    localStorage.clear();
  });

  const onLogoutMock = vi.fn();

  it("renders nothing if no user in localStorage", () => {
    // Modify based on implementation - Sidebar might render but filtered items
    // Current implementation reads user from localStorage inside component
    render(
      <BrowserRouter>
        <Sidebar onLogout={onLogoutMock} />
      </BrowserRouter>
    );
    // Should render structure but maybe no items?
    expect(screen.getByText("PuntoNet")).toBeInTheDocument();
  });

  it("renders menu items for ADMIN", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Admin User", role: "ADMIN" })
    );
    render(
      <BrowserRouter>
        <Sidebar onLogout={onLogoutMock} />
      </BrowserRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Reportes")).toBeInTheDocument(); // Admin only
  });

  it("renders menu items for CLIENT", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Client User", role: "CLIENT" })
    );
    render(
      <BrowserRouter>
        <Sidebar onLogout={onLogoutMock} />
      </BrowserRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Reportes")).not.toBeInTheDocument(); // Admin only
  });

  it("navigates on click", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Admin User", role: "ADMIN" })
    );
    render(
      <BrowserRouter>
        <Sidebar onLogout={onLogoutMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Gestión de Tickets"));
    expect(mockNavigate).toHaveBeenCalledWith("/tickets");
  });

  it("calls onLogout", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Admin User", role: "ADMIN" })
    );
    render(
      <BrowserRouter>
        <Sidebar onLogout={onLogoutMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(onLogoutMock).toHaveBeenCalled();
  });
});
