import mongoose from "mongoose"
import dns from "dns"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })
        console.log(`MONGODB CONNECTED: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        // Do not call process.exit(1) in a serverless environment
    }
}
export default connectDB;