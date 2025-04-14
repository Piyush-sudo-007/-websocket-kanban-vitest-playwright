import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Column from "./Column";
import TaskForm from "./TaskForm";
import Modal from "react-modal";
import TaskProgressGraph from "./TaskProgressGraph";

const socket = io("http://localhost:5000");
Modal.setAppElement("#root");

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    socket.on("sync:tasks", (data) => {
      console.log("Received tasks from server: ", data);
      setTasks(data);
    });

    return () => {
      socket.off("sync:tasks");
    };
  }, []);

  const handleAddTask = (newTask) => {
    socket.emit("task:create", newTask);
  };

  const handleTaskMove = (taskId, newColumn) => {
    socket.emit("task:move", { taskId, newColumn });
  };

  const handleTaskUpdate = (updatedTask) => {
    socket.emit("task:update", updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    socket.emit("task:delete", taskId);
  };

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Real-time Kanban Board</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add Task
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((column) => (
          <Column
            key={column}
            column={column}
            tasks={tasks.filter((task) => task.column === column)}
            onDropTask={handleTaskMove}
            onUpdateTask={handleTaskUpdate}
            onDeleteTask={handleTaskDelete}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
          },
        }}
      >
        <h3>Add New Task</h3>
        <TaskForm
          onAddTask={(task) => {
            handleAddTask(task);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
      <div style={{ marginBottom: "30px" }}>
        <TaskProgressGraph tasks={tasks} />
      </div>
    </div>
  );
};

export default KanbanBoard;
