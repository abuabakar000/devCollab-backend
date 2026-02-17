import Message from "../models/Message.js";
import User from "../models/User.js";

export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user._id;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
        });

        await newMessage.save();

        // Send response FIRST so sender sees their message immediately
        res.status(201).json(newMessage);

        // Then push real-time message to receiver via Pusher (fire & forget)
        try {
            const pusher = req.app.get("pusher");
            pusher.trigger(`user-${receiverId}`, "new-message", {
                senderId: senderId.toString(),
                senderName: req.user.name,
                senderPic: req.user.profilePic,
                text,
            });
        } catch (pusherErr) {
            console.error("Pusher trigger failed:", pusherErr.message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get IDs of people the user has messaged
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ createdAt: -1 });

        const participantsSet = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== userId.toString()) participantsSet.add(msg.sender.toString());
            if (msg.receiver.toString() !== userId.toString()) participantsSet.add(msg.receiver.toString());
        });

        const participantsIds = Array.from(participantsSet);

        // 2. Get all users who are currently "online" (active in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const onlineUsers = await User.find({
            lastActive: { $gte: fiveMinutesAgo },
            _id: { $ne: userId } // Don't include yourself
        }).select("_id");

        const onlineIds = onlineUsers.map(u => u._id.toString());

        // 3. Combine both lists (History + Online Now)
        const allRelevantIds = Array.from(new Set([...onlineIds, ...participantsIds]));

        // 4. Fetch details for all these users
        const users = await User.find({
            _id: { $in: allRelevantIds }
        }).select("name profilePic bio lastActive");

        // 5. Custom Sorting Implementation:
        // - Online users (last active < 5m) come first
        // - Within those groups, sort by lastActive descending
        const sortedUsers = users.sort((a, b) => {
            const aOnline = a.lastActive && a.lastActive >= fiveMinutesAgo;
            const bOnline = b.lastActive && b.lastActive >= fiveMinutesAgo;

            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;

            // If both same status, sort by last active date
            return (b.lastActive || 0) - (a.lastActive || 0);
        });

        res.json(sortedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
