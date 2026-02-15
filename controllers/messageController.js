import Message from "../models/Message.js";

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

        // Find users the current user has messaged
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ createdAt: -1 });

        const participants = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== userId.toString()) participants.add(msg.sender.toString());
            if (msg.receiver.toString() !== userId.toString()) participants.add(msg.receiver.toString());
        });

        res.json(Array.from(participants));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
