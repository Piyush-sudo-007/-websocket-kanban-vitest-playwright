import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/kanban';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
