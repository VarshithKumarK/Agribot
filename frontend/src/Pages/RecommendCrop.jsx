import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTractor, FaFlask, FaWater, FaCheckCircle, FaBalanceScale } from "react-icons/fa"; // Added FaBalanceScale
import { ScaleLoader } from "react-spinners";
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
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const RecommendCrop = () => {
  const [form, setForm] = useState({
    soil: "",
    ph: "",
    irrigation: "",
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setRecommendations(null);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/voice/recommendCrop",
        form,
        {
          withCredentials: true,
        }
      );
      setRecommendations(res.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to get crop recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen  bg-gradient-to-br from-green-50 via-green-100 to-white p-8 flex flex-col justify-center items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-4xl mt-15 font-extrabold text-green-700 text-center mb-8"
        variants={itemVariants}
      >
        <FaTractor className="inline-block mr-2" /> Smart Crop Advisor
      </motion.h2>

      <motion.div
        className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6"
        variants={itemVariants}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 border rounded-md p-3 focus-within:ring-2 focus-within:ring-green-400">
            <FaFlask className="text-green-500" />
            <select
              name="soil"
              value={form.soil}
              onChange={handleChange}
              className="w-full outline-none text-gray-700"
            >
              <option value="" disabled>
                Select Soil Type
              </option>
              <option value="loamy">Loamy</option>
              <option value="clayey">Clayey</option>
              <option value="sandy">Sandy</option>
              <option value="silty">Silty</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 border rounded-md p-3 focus-within:ring-2 focus-within:ring-green-400">
            <FaBalanceScale className="text-green-500" />
            <input
              type="number"
              step="0.1"
              name="ph"
              value={form.ph}
              onChange={handleChange}
              placeholder="Enter Soil pH (e.g., 6.5)"
              className="w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center space-x-3 border rounded-md p-3 focus-within:ring-2 focus-within:ring-green-400">
            <FaWater className="text-green-500" />
            <select
              name="irrigation"
              value={form.irrigation}
              onChange={handleChange}
              className="w-full outline-none text-gray-700"
            >
              <option value="" disabled>
                Irrigation Available?
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <motion.button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={loading}
        >
          {loading ? <ScaleLoader color="#fff" size={20} /> : "Get Crop Recommendations"}
        </motion.button>

        {error && (
          <motion.p
            className="text-red-500 text-sm mt-2"
            variants={itemVariants}
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {recommendations && (
        <motion.div
          className="bg-white shadow-md rounded-lg p-6 mt-8 w-full max-w-md"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
            <FaCheckCircle className="mr-2 text-green-500" /> Recommended Crops:
          </h3>
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-gray-800 whitespace-pre-line font-medium">
              {recommendations}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecommendCrop;