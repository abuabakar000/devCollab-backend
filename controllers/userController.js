import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* GET CURRENT USER */
export const getCurrentUser = async (req, res) => {
  res.json(req.user);
};

/* FOLLOW / UNFOLLOW USER */
export const toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const isFollowing = req.user.following.includes(targetUser._id);

    if (isFollowing) {
      req.user.following = req.user.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      req.user.following.push(targetUser._id);
      targetUser.followers.push(req.user._id);

      // Create Notification
      const notification = await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        type: "follow",
      });

      // Emit real-time notification via Pusher (fire & forget)
      try {
        const pusher = req.app.get("pusher");
        const populatedNotification = await notification.populate("sender", "name profilePic");
        pusher.trigger(`user-${targetUser._id.toString()}`, "new-notification", JSON.parse(JSON.stringify(populatedNotification)));
      } catch (pusherErr) {
        console.error("Pusher trigger failed (follow):", pusherErr.message);
      }
    }

    await req.user.save();
    const updatedTargetUser = await targetUser.save();

    res.json(updatedTargetUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE USER PROFILE */
export const updateUser = async (req, res) => {
  try {
    const { name, email, bio, techStack, githubLink, portfolioLink, linkedinLink } = req.body;

    // Check if user exists (already authenticated so req.user is populated, but good practice if logic shifts)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (techStack) {
      // Handle techStack if it comes as a string (comma separated) or array
      user.techStack = Array.isArray(techStack)
        ? techStack
        : techStack.split(',').map(tech => tech.trim());
    }
    if (githubLink !== undefined) user.githubLink = githubLink;
    if (portfolioLink !== undefined) user.portfolioLink = portfolioLink;
    if (linkedinLink !== undefined) user.linkedinLink = linkedinLink;

    // Handle profilePic if uploaded via middleware or sent as URL
    // Assuming uploadMiddleware might attach file info to req.file
    if (req.file) {
      user.profilePic = req.file.path || req.file.secure_url || req.file.url;
    } else if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }

    const updatedUser = await user.save();

    // Return updated user sans password
    updatedUser.password = undefined;

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* SEARCH USERS */
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name email profilePic bio")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET FOLLOWERS LIST */
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name email profilePic bio");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET FOLLOWING LIST */
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following", "name email profilePic bio");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
