import Post from "../models/Post.js";
import Notification from "../models/Notification.js";


export const createPost = async (req, res) => {
  try {
    const { title, text, techStack, githubRepoLink } = req.body;

    console.log("Files received:", req.files); // Updated for multiple files
    const images = req.files ? req.files.map(file => file.path || file.secure_url || file.url) : [];
    console.log("Images extracted:", images);

    // Handle techStack split if it's a string
    let parsedTechStack = [];
    if (techStack) {
      parsedTechStack = Array.isArray(techStack)
        ? techStack
        : techStack.split(',').map(t => t.trim());
    }

    const post = await Post.create({
      user: req.user._id,
      title, // New field: Project Title
      text,  // Repurposed: Project Description
      techStack: parsedTechStack, // New field: Project Tech Stack
      githubRepoLink, // New field: Project Repo
      images, // Store array of images
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* GET ALL POSTS */
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE POST */
export const updatePost = async (req, res) => {
  try {
    const { title, text, techStack, githubRepoLink } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    console.log("Update files received:", req.files);

    const newImages = req.files ? req.files.map(file => file.path || file.secure_url || file.url) : [];

    // If new images are provided, we replace the old ones. 
    // Or we could append. User said "title of the post would always be the first image"
    // So if they upload new ones, we use those.
    if (newImages.length > 0) {
      post.images = newImages;
    } else if (req.body.images !== undefined) {
      // If images array is sent in body (for deletions without new uploads)
      post.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (title) post.title = title;
    if (text) post.text = text; // Description
    if (githubRepoLink) post.githubRepoLink = githubRepoLink;

    if (techStack) {
      post.techStack = Array.isArray(techStack)
        ? techStack
        : techStack.split(',').map(t => t.trim());
    }

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* LIKE / UNLIKE POST */
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);

      // Create Notification if not liking own post
      if (post.user.toString() !== req.user._id.toString()) {
        const notification = await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: "like",
          post: post._id,
        });

        // Emit real-time notification
        const io = req.app.get("socketio");
        const populatedNotification = await notification.populate([
          { path: "sender", select: "name profilePic" },
          { path: "post", select: "title" }
        ]);
        io.to(post.user.toString()).emit("newNotification", populatedNotification);
      }
    }

    await post.save();

    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    // Create Notification for post owner
    if (post.user.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: "comment",
        post: post._id,
      });

      // Emit real-time notification
      const io = req.app.get("socketio");
      const populatedNotification = await notification.populate([
        { path: "sender", select: "name profilePic" },
        { path: "post", select: "title" }
      ]);
      io.to(post.user.toString()).emit("newNotification", populatedNotification);
    }

    // Re-fetch populated post to get comment user details immediately
    const updatedPost = await Post.findById(req.params.id).populate("comments.user", "name profilePic");

    res.status(201).json(updatedPost.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    // Re-fetch populated post to get updated comment user details
    const updatedPost = await Post.findById(req.params.id).populate("comments.user", "name profilePic");

    res.json(updatedPost.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* GET FEED POSTS (only followed users) */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: { $in: req.user.following },
    })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET POSTS BY USER ID */
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE POST BY ID */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name profilePic bio techStack githubLink portfolioLink")
      .populate("comments.user", "name profilePic");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

