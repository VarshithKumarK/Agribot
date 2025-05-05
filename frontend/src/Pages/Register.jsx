import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        toast.success("Registered Successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-700 via-yellow-100 to-green-300 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-green-800 mb-6">
          🌱 Create Your AgriBot Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Farmer Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="farmer@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="user">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
