import Post from '../models/Post.js';

// Create a new post
export const createPost = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const newPost = new Post({ user: userId, text });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate('responses.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Add a response to a post
export const addResponse = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    post.responses.push({ user: userId, text });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add response' });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Delete a response
export const deleteResponse = async (req, res) => {
    const { postId, responseId } = req.params;
  
    try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ error: 'Post not found' });
  
      const responseIndex = post.responses.findIndex(
        (r) => r._id.toString() === responseId
      );
      if (responseIndex === -1) {
        return res.status(404).json({ error: 'Response not found' });
      }
  
      // Optional: check if user is the owner
      if (post.responses[responseIndex].user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized to delete this response' });
      }
  
      post.responses.splice(responseIndex, 1); // Remove the response
      await post.save();
  
      res.json({ message: 'Response deleted successfully' });
    } catch (err) {
      console.error('Delete response error:', err);
      res.status(500).json({ error: 'Failed to delete response' });
    }
  };
  