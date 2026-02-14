import User from './models/User.js';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const test = async () => {
    await connectDB();
    const email = `test_${Date.now()}@example.com`;
    try {
        const hashedPassword = await bcrypt.hash("password123", 10);
        const user = await User.create({
            name: "Test User",
            email,
            password: hashedPassword
        });
        console.log("Registration Test: SUCCESS");
        console.log("New User ID:", user._id);

        // Cleanup
        await User.findByIdAndDelete(user._id);
        console.log("Cleanup Test User: DONE");
    } catch (err) {
        console.error("Registration Test: FAILED");
        console.error(err);
    }
    process.exit(0);
};

test();
