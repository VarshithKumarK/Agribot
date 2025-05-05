import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUserAlt, FaEnvelope, FaUpload } from "react-icons/fa";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/update-profile-pic",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(res.data);
      toast.success("Profile picture updated!");
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      toast.error("Failed to upload profile picture");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <p className="text-lg">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-100 to-green-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white/60 backdrop-blur-lg border border-green-200 rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-green-800 tracking-wide">
          🌿 Welcome, Farmer!
        </h1>

        <div className="flex justify-center">
          {user?.profilePic || preview ? (
            <img
              src={preview || user.profilePic}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-green-500 object-cover shadow-md hover:shadow-green-300 transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-base border-2 border-green-400">
              No Photo
            </div>
          )}
        </div>

        <div className="space-y-2 text-green-800">
          <div className="flex items-center justify-center gap-2 text-xl font-medium">
            <FaUserAlt />
            <span>{user?.username || "No username"}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-md">
            <FaEnvelope />
            <span>{user?.email}</span>
          </div>
        </div>

        <div className="space-y-4 ">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-green-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-200 file:text-green-700 hover:file:bg-green-300"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-green-400 shadow-sm"
            />
          )}
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              className="flex items-center justify-center gap-2 bg-green-600  hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-green-400"
            >
              <FaUpload />
              {user?.profilePic ? "Update Photo" : "Upload Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
