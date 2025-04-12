import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import Select from "react-select";

const Task = ({ task, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [attachments, setAttachments] = useState(task.attachments);
  const [filePreview, setFilePreview] = useState(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments([...attachments, file.name]);
      if (file.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUpdate = () => {
    onUpdate({ ...task, title, description, priority, category, attachments });
  };

  // Cleanup the file preview URL when the component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div
      ref={drag}
      style={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: "#fff",
        opacity: isDragging ? 0.5 : 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.2s",
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdate}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleUpdate}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />
      <div style={{ marginBottom: "8px" }}>
        <Select
          value={priorityOptions.find((option) => option.value === priority)}
          options={priorityOptions}
          onChange={(opt) => {
            setPriority(opt.value);
            handleUpdate();
          }}
        />
      </div>
      <div style={{ marginBottom: "8px" }}>
        <Select
          value={categoryOptions.find((option) => option.value === category)}
          options={categoryOptions}
          onChange={(opt) => {
            setCategory(opt.value);
            handleUpdate();
          }}
        />
      </div>
      <input type="file" onChange={handleFileChange} />
      {filePreview && (
        <img
          src={filePreview}
          alt="Preview"
          style={{
            maxWidth: "100px",
            marginTop: "10px",
            borderRadius: "4px",
          }}
        />
      )}
      <button
        onClick={() => onDelete(task.id)}
        style={{
          marginTop: "10px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Task;
