import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import Select from "react-select";

const Task = ({ task, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [filePreview, setFilePreview] = useState(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task._id },
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
    onUpdate({
      ...task,
      title,
      description,
      priority,
      category,
      attachments,
    });
  };

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
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "10px",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdate}
        style={{ width: "100%", marginBottom: "8px" }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleUpdate}
        style={{ width: "100%", marginBottom: "8px" }}
      />
      <Select
        value={priorityOptions.find((opt) => opt.value === priority)}
        options={priorityOptions}
        onChange={(opt) => {
          setPriority(opt.value);
          handleUpdate();
        }}
      />
      <Select
        value={categoryOptions.find((opt) => opt.value === category)}
        options={categoryOptions}
        onChange={(opt) => {
          setCategory(opt.value);
          handleUpdate();
        }}
      />
      <input type="file" onChange={handleFileChange} />
      {filePreview && <img src={filePreview} alt="Preview" width="100" />}
      <button
        onClick={() => onDelete(task._id)}
        style={{
          marginTop: "10px",
          backgroundColor: "#dc3545",
          color: "#fff",
          padding: "6px 12px",
          border: "none",
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
