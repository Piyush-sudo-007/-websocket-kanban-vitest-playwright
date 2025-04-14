// backend/index.js
import express from "express";
import http from "http";
import { Server } from 'socket.io';
import cors from "cors";
import connectDB from './db/db.js';
import Task from './db/model.js';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

connectDB();

io.on('connection', (socket) => {
  console.log('A user connected');

  Task.find()
    .then((tasks) => {
      socket.emit('sync:tasks', tasks);
    })
    .catch((err) => {
      console.error('Error fetching tasks:', err);
      socket.emit('sync:tasks', []);
    });

  socket.on('task:create', async (taskData) => {
    try {
      const newTask = new Task(taskData);
      await newTask.save();
      io.emit('sync:tasks', await Task.find());
    } catch (err) {
      console.error('Error creating task:', err);
    }
  });

  socket.on('task:update', async (updatedTask) => {
    try {
      await Task.findByIdAndUpdate(updatedTask.id, updatedTask, { new: true });
      io.emit('sync:tasks', await Task.find());
    } catch (err) {
      console.error('Error updating task:', err);
    }
  });

  socket.on("task:move", async ({ taskId, newColumn }) => {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { column: newColumn },
      { new: true }
    );
    const allTasks = await Task.find();
    io.emit("sync:tasks", allTasks);
  });
  

  socket.on('task:delete', async (taskId) => {
    try {
      await Task.findByIdAndDelete(taskId);
      io.emit('sync:tasks', await Task.find());
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
