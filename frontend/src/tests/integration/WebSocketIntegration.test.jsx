import { render, screen, waitFor } from "@testing-library/react";
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

test("WebSocket receives task update", async () => {
  render(<App />);

  // Wait for the loading state to disappear
  await waitFor(
    () => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    },
    { timeout: 5000 }
  );

  const addButton = screen.getByText("Add Task");
  expect(addButton).toBeVisible();

  await userEvent.click(addButton);
  socket.emit("task:update", { updatedTask: "Task A" });

  // Now check that the task appears
  const newTask = await screen.findByText("Real-time Kanban Board");
  expect(newTask).toBeInTheDocument();
});
