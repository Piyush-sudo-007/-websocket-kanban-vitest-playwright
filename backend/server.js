import express from "express";
import http from "http";
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let tasks = [
  { id: '1', title: 'Task A', description: 'Description A', column: 'To Do', priority: 'Low', category: 'Feature', attachments: [] },
  { id: '2', title: 'Task B', description: 'Description B', column: 'In Progress', priority: 'Medium', category: 'Bug', attachments: [] },
  { id: '3', title: 'Task C', description: 'Description C', column: 'Done', priority: 'High', category: 'Enhancement', attachments: [] },
];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('sync:tasks', tasks);

  socket.on('task:create', (task) => {
    tasks.push(task);
    io.emit('sync:tasks', tasks);
  });

  socket.on('task:update', (updatedTask) => {
    tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    io.emit('sync:tasks', tasks);
  });

  socket.on('task:move', ({ taskId, newColumn }) => {
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, column: newColumn } : task
    );
    io.emit('sync:tasks', tasks);
  });

  socket.on('task:delete', (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    io.emit('sync:tasks', tasks);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});