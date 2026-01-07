import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TicketRow } from "../TicketRow";
import { BrowserRouter } from "react-router-dom";
import { Ticket } from "@/types";

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TicketRow Component", () => {
  const mockTicket: Ticket = {
    id: "1",
    subject: "Test Ticket",
    description: "Test Description",
    status: "OPEN",
    priority: "HIGH",
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "user1",
    client: { id: "user1", name: "John Doe", email: "john@example.com", role: "CLIENT", createdAt: new Date(), updatedAt: new Date(), isTwoFactorEnabled: false },
    creator: { id: "user1", name: "John Doe", email: "john@example.com", role: "CLIENT", createdAt: new Date(), updatedAt: new Date(), isTwoFactorEnabled: false },
    messages: [],
    attachments: [],
  };

  const defaultProps = {
    ticket: mockTicket,
    isAdmin: false,
    onDelete: vi.fn(),
  };

  it("renders ticket information correctly", () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <TicketRow {...defaultProps} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    expect(screen.getByText("Test Ticket")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("navigates to ticket detail on click", () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <TicketRow {...defaultProps} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Test Ticket").closest("tr")!);
    expect(mockNavigate).toHaveBeenCalledWith("/tickets/1");
  });

  it("shows delete button for admin", () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <TicketRow {...defaultProps} isAdmin={true} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    expect(screen.getByLabelText("Eliminar ticket")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <TicketRow {...defaultProps} isAdmin={true} onDelete={onDelete} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    const deleteButton = screen.getByLabelText("Eliminar ticket");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
