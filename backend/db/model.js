import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  column: {
    type: String,
    default: 'To Do',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  category: {
    type: String,
    enum: ['Feature', 'Bug', 'Enhancement'],
    default: 'Feature',
  },
  attachments: [{
    type: String,
  }],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
