import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected !!");
    } catch (error) {
        console.log('MONGODB connection failed', error);
        process.exit(1);
    }
}

export default connectDB;