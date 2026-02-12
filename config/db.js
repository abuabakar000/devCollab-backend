import mongoose from "mongoose"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")
dns.setServers(["8.8.8.8"])

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { family: 4, serverSelectionTimeoutMS: 5000 })
        console.log(`MONGODB CONNECTED : ${conn.connection.host}`);

    } catch (error) {
        console.log(`Database connection error`, error.message);
        process.exit(1)


    }
}
export default connectDB;