import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUserAlt, FaEnvelope } from "react-icons/fa";

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
    if (!selectedFile) {
      return toast.error("No file selected");
    }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-100 to-green-100 text-green-900 px-4 py-12">
      <div className="flex flex-col items-center mt-15">
        <h1 className="text-4xl font-extrabold text-green-800 mb-10">
          🌾 Welcome, Farmer!
        </h1>

        <div className="relative">
          {user?.profilePic || preview ? (
            <img
              src={preview || user.profilePic}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-green-600 object-cover shadow-xl transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-green-200 flex items-center justify-center text-green-600 text-sm border-2 border-green-400">
              No Photo
            </div>
          )}
        </div>

        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xl font-semibold text-green-700">
            <FaUserAlt className="text-green-600" />
            <span>{user?.username || "No username"}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-md text-green-600">
            <FaEnvelope className="text-green-500" />
            <span>{user?.email}</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block mx-auto text-sm text-green-700 mb-4"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-green-400 shadow"
            />
          )}

          <button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition shadow-md"
          >
            {user?.profilePic ? "Update Photo" : "Upload Photo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
