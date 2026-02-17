import User from "../models/User.js";

const activityMiddleware = async (req, res, next) => {
    if (req.user) {
        // Only update if lastActive was more than 1 minute ago to reduce DB writes
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

        if (!req.user.lastActive || req.user.lastActive < oneMinuteAgo) {
            try {
                await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });
            } catch (err) {
                console.error("Activity tracking error:", err.message);
            }
        }
    }
    next();
};

export default activityMiddleware;
