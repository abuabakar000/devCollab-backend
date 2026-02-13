import mongoose from "mongoose"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 100000 // Increase timeout for initial connection
        })
        console.log(`MONGODB CONNECTED: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
    }
}
export default connectDB;