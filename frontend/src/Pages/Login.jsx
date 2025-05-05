import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("Login Successful");
        navigate("/");
      } else {
        console.log("Unexpected response structure", res);
        setError("Invalid response from server");
      }
    } catch (error) {
      console.log("Login Error:", error);
      setError(
        error.response?.data?.message || "Login Failed. Please try again."
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-yellow-500">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-green-900 border border-green-300">
        <h2 className="text-3xl font-bold text-center mb-6 ">
          🌾 AgriBot Login
        </h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full mt-1 p-2 rounded bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full mt-1 p-2 rounded bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>
          <button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow transition"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-green-800">
          Don't have an account?{" "}
          <Link className="text-yellow-700 hover:underline font-semibold" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
