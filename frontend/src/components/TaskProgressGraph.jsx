import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const TaskProgressGraph = ({ tasks }) => {
  const taskCounts = tasks.reduce(
    (acc, task) => {
      if (acc[task.column] !== undefined) {
        acc[task.column] += 1;
      }
      return acc;
    },
    { "To Do": 0, "In Progress": 0, Done: 0 }
  );

  const data = [
    { name: "To Do", count: taskCounts["To Do"] },
    { name: "In Progress", count: taskCounts["In Progress"] },
    { name: "Done", count: taskCounts["Done"] },
  ];

  const totalTasks = tasks.length;
  const doneTasks = taskCounts.Done;
  const completionPercentage =
    totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const barColors = {
    "To Do": "#8884d8",
    "In Progress": "#82ca9d",
    Done: "#ffc658",
  };

  return (
    <div>
      <h2>Task Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Completion: {completionPercentage.toFixed(2)}%
      </p>
    </div>
  );
};

export default TaskProgressGraph;
