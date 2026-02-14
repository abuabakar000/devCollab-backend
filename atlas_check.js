import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

dotenv.config();

console.log("--- MongoDB Atlas Diagnostic ---");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Defined (Hidden for security)" : "UNDEFINED");

if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in .env");
    process.exit(1);
}

// Force a specific DNS server to avoid resolution issues common in some environments
dns.setServers(['8.8.8.8', '8.8.4.4']);

const check = async () => {
    try {
        console.log("Attempting to connect...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ SUCCESS!");
        console.log("Connected Host:", conn.connection.host);
        console.log("Database Name:", conn.connection.name);
        await mongoose.connection.close();
    } catch (err) {
        console.error("❌ CONNECTION FAILED");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.reason) console.error("Reason:", err.reason);
    }
    process.exit(0);
};

check();
