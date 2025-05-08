import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaSeedling,
  FaCommentDots,
  FaTrashAlt,
  FaReply,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";
import { formatDistanceToNowStrict } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
};

const FarmChat = () => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [responseTexts, setResponseTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [responding, setResponding] = useState({});
  const [deletingPost, setDeletingPost] = useState(null);
  const [deletingResponse, setDeletingResponse] = useState({});

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api", {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Optionally set an error state to display a message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPostText.trim()) return;
    setPosting(true);
    try {
      await axios.post(
        "http://localhost:5000/api",
        { text: newPostText },
        { withCredentials: true }
      );
      setNewPostText("");
      fetchPosts();
    } catch (error) {
      console.error("Error submitting post:", error);
      // Optionally handle error display
    } finally {
      setPosting(false);
    }
  };

  const handleSubmitResponse = async (postId) => {
    if (!responseTexts[postId]?.trim()) return;
    setResponding({ ...responding, [postId]: true });
    try {
      await axios.post(
        `http://localhost:5000/api/${postId}/response`,
        { text: responseTexts[postId] },
        { withCredentials: true }
      );
      setResponseTexts({ ...responseTexts, [postId]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error submitting response:", error);
      // Optionally handle error display
    } finally {
      setResponding({ ...responding, [postId]: false });
    }
  };

  const handleDeletePost = async (postId) => {
    setDeletingPost(postId);
    try {
      await axios.delete(`http://localhost:5000/api/${postId}`, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      // Optionally handle error display
    } finally {
      setDeletingPost(null);
    }
  };

  const handleDeleteResponse = async (postId, responseId) => {
    setDeletingResponse({ ...deletingResponse, [`${postId}-${responseId}`]: true });
    try {
      await axios.delete(
        `http://localhost:5000/api/${postId}/response/${responseId}`,
        { withCredentials: true }
      );
      fetchPosts();
    } catch (error) {
      console.error("Error deleting response:", error);
      // Optionally handle error display
    } finally {
      setDeletingResponse({ ...deletingResponse, [`${postId}-${responseId}`]: false });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-white p-6 sm:p-8 md:p-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-4xl mt-15 font-extrabold text-green-700 text-center mb-8 flex items-center justify-center"
        variants={itemVariants}
      >
        <FaSeedling className="mr-3" /> <FaCommentDots /> Farm Chat
      </motion.h2>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-3xl mx-auto"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-4">
          <FaUserCircle className="text-gray-400 text-xl" />
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Share your wisdom or ask a question..."
            rows={3}
          />
        </div>
        <motion.button
          onClick={handleSubmitPost}
          className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition duration-300 shadow-md ${
            posting ? "cursor-wait opacity-70" : ""
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={posting}
        >
          {posting ? <FaSpinner className="animate-spin" /> : "Post"}
        </motion.button>
      </motion.div>

      <div className="space-y-8 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-green-500 text-3xl" />
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post._id}
              className="bg-white rounded-lg shadow-md p-6 relative"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <FaUserCircle className="text-gray-500" />
                  <div className="text-sm">
                    <strong className="text-green-700">{post.user.name}</strong>
                    <p className="text-gray-500">{formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleDeletePost(post._id)}
                  className={`text-red-500 hover:text-red-600 transition-colors duration-200 ${
                    deletingPost === post._id ? "cursor-wait opacity-70" : ""
                  }`}
                  disabled={deletingPost === post._id}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaTrashAlt />
                </motion.button>
              </div>
              <p className="text-gray-800 leading-relaxed mt-2">{post.text}</p>

              <div className="mt-4 space-y-4">
                {post.responses.map((response) => (
                  <div
                    key={response._id}
                    className="bg-gray-50 rounded-md p-3 ml-6 border-l-2 border-blue-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-sm">
                        <strong className="text-blue-700">{response.user.name}</strong>
                        <p className="text-gray-500">{formatDistanceToNowStrict(new Date(response.createdAt), { addSuffix: true })}</p>
                        <p className="text-gray-600">{response.text}</p>
                      </div>
                      <motion.button
                        onClick={() => handleDeleteResponse(post._id, response._id)}
                        className={`text-red-400 hover:text-red-500 transition-colors duration-200 ${
                          deletingResponse[`${post._id}-${response._id}`] ? "cursor-wait opacity-70" : ""
                        }`}
                        disabled={deletingResponse[`${post._id}-${response._id}`]}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <FaTrashAlt className="text-xs" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <FaReply className="text-blue-500" />
                <textarea
                  value={responseTexts[post._id] || ""}
                  onChange={(e) =>
                    setResponseTexts({
                      ...responseTexts,
                      [post._id]: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Reply to this post..."
                  rows={2}
                />
                <motion.button
                  onClick={() => handleSubmitResponse(post._id)}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition duration-300 shadow ${
                    responding[post._id] ? "cursor-wait opacity-70" : ""
                  }`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={responding[post._id]}
                >
                  {responding[post._id] ? <FaSpinner className="animate-spin" /> : "Reply"}
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default FarmChat;