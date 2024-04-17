import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (connected) {
    console.log('MongoDB is already connected. Happy serving...');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log(`DB Connect successfully!`);
  } catch (err) {
    console.log(`DB connection failed: ${err.message}`);
  }
};

export default connectDB;
