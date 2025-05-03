import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import moment from "moment";

const Query = () => {
  const { user } = useContext(AuthContext);
  const [queries, setQueries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/query/user", {
        withCredentials: true,
      });
      setQueries(res.data);
    } catch (err) {
      toast.error("Failed to fetch queries");
    }
  };

  const deleteQuery = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/query/${id}`, {
        withCredentials: true,
      });
      toast.success("Query deleted");
      setQueries(queries.filter((q) => q._id !== id));
    } catch (err) {
      toast.error("Failed to delete query");
    }
  };

  const deleteAll = async () => {
    try {
      await axios.delete("http://localhost:5000/api/query", {
        withCredentials: true,
      });
      toast.success("All queries deleted");
      setQueries([]);
    } catch (err) {
      toast.error("Failed to delete all queries");
    }
  };

  useEffect(() => {
    if (user) fetchQueries();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-100 p-6">
      <h1 className="text-3xl font-bold mt-15 text-green-800 mb-6 text-center">
        🌾 Your Farm Queries
      </h1>

      {queries.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={deleteAll}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:brightness-110 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300"
            >
              🗑 Delete All Queries
            </button>
          </div>

          {queries.map((query) => (
            <div
              key={query._id}
              className="bg-white shadow-xl rounded-lg p-4 border-l-4 border-green-600 transition-transform hover:scale-[1.01]"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(query._id)}
              >
                <div>
                  <p className="text-lg font-bold text-green-800">
                    {query.question || "Untitled Query"}
                  </p>
                  {/* <p className="text-sm text-gray-600">Session ID: {query.sessionId || "N/A"}</p> */}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuery(query._id);
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={18} />
                  </button>
                  {expandedId === query._id ? (
                    <FaChevronUp className="text-green-600" />
                  ) : (
                    <FaChevronDown className="text-green-600" />
                  )}
                </div>
              </div>

              {expandedId === query._id && (
                <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-300 text-sm text-green-900 space-y-1">
                  <p>
                    <strong>🌱 Question:</strong> {query.question}
                  </p>
                  <p>
                    <strong>🎯 Intent:</strong> {query.intent || "N/A"}
                  </p>
                  <p>
                    <strong>💬 Response:</strong> {query.response || "N/A"}
                  </p>
                  {/* <p><strong>🧾 Session ID:</strong> {query.sessionId || "N/A"}</p> */}
                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {moment(query.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10 text-lg">
          No queries found. Ask something to your AgriBot 🌾
        </p>
      )}
    </div>
  );
};

export default Query;
