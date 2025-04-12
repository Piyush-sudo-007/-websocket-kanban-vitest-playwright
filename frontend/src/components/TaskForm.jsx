import React, { useState } from "react";
import Select from "react-select";

function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

const TaskForm = ({ onAddTask, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Feature");

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const categoryOptions = [
    { value: "Bug", label: "Bug" },
    { value: "Feature", label: "Feature" },
    { value: "Enhancement", label: "Enhancement" },
  ];

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required.");
      return;
    }

    onAddTask({
      id: generateUniqueId(),
      title,
      description,
      column: "To Do",
      priority,
      category,
      attachments: [],
    });

    // Optionally reset form and close
    setTitle("");
    setDescription("");
    setPriority("Low");
    setCategory("Feature");
    onClose();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "10px",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />
      <Select
        value={priorityOptions.find((option) => option.value === priority)}
        options={priorityOptions}
        onChange={(opt) => setPriority(opt.value)}
      />
      <Select
        value={categoryOptions.find((option) => option.value === category)}
        options={categoryOptions}
        onChange={(opt) => setCategory(opt.value)}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
