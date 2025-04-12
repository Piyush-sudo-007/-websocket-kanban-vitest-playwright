import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import io from "socket.io-client";
import Task from "./Task";
import TaskForm from "./TaskForm";
import TaskProgressGraph from "./TaskProgressGraph";

const socket = io("http://localhost:5000");

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on("sync:tasks", (updatedTasks) => {
      console.log("Received tasks from server:", updatedTasks);
      setTasks(updatedTasks);
      setLoading(false);
    });

    return () => {
      socket.off("sync:tasks");
    };
  }, []);

  const moveTask = (taskId, newColumn) => {
    socket.emit("task:move", { taskId, newColumn });
  };

  const addTask = (newTask) => {
    socket.emit("task:create", newTask);
    setShowForm(false);
  };

  const updateTask = (updatedTask) => {
    socket.emit("task:update", updatedTask);
  };

  const deleteTask = (taskId) => {
    socket.emit("task:delete", taskId);
  };

  const [{ isOver: todoIsOver }, todoDrop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, "To Do"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  const [{ isOver: inProgressIsOver }, inProgressDrop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, "In Progress"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  const [{ isOver: doneIsOver }, doneDrop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, "Done"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <button
        onClick={() => setShowForm(true)}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Task
      </button>
      {showForm && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <TaskForm onAddTask={addTask} onClose={() => setShowForm(false)} />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          { name: "To Do", ref: todoDrop, isOver: todoIsOver },
          {
            name: "In Progress",
            ref: inProgressDrop,
            isOver: inProgressIsOver,
          },
          { name: "Done", ref: doneDrop, isOver: doneIsOver },
        ].map((col) => (
          <div
            key={col.name}
            ref={col.ref}
            style={{
              flex: "1 1 30%",
              minWidth: "300px",
              backgroundColor: col.isOver ? "#f1f1f1" : "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "background-color 0.3s ease",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>{col.name}</h3>
            {tasks
              .filter((task) => task.column === col.name)
              .map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <TaskProgressGraph tasks={tasks} />
      </div>
    </div>
  );
};

export default KanbanBoard;
