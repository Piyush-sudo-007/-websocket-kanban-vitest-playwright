import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

const Column = ({ column, tasks, onDropTask, onUpdateTask, onDeleteTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => {
      onDropTask(item.id, column);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        minHeight: "80vh",
        backgroundColor: isOver ? "#f0f0f0" : "#eaeaea",
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <h2>{column}</h2>
      {tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default Column;
