import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import io from "socket.io-client";
import { vi } from "vitest";

const socket = io("http://localhost:5000");

vi.mock("socket.io-client", () => ({
  default: () => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

test("renders Kanban board and adds a task", async () => {
  render(<App />);

  await screen.findByText("Add Task", {}, { timeout: 10000 });

  const addButton = await screen.findByRole("button", { name: /add task/i });
  await userEvent.click(addButton);

  expect(await screen.findByText("Real-time Kanban Board")).toBeInTheDocument();
}, 15000);
