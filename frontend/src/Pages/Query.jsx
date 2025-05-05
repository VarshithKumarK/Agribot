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
      <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 mt-16 tracking-wide">
        🌾 Your Farm Queries
      </h1>

      {queries.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end mb-8">
            <button
              onClick={deleteAll}
              className="bg-gradient-to-tr from-red-400 to-red-400 hover:from-red-500 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition duration-300 hover:scale-105 flex items-center gap-2"
            >
              🗑 Delete All
            </button>
          </div>

          <div className="space-y-6">
            {queries.map((query, index) => {
              const isLeft = index % 2 === 0;
              const alignment = isLeft ? "justify-start" : "justify-end";
              const bubbleColor = "bg-white/40 backdrop-blur-md";
              const textAlign = isLeft ? "text-left" : "text-right";
              return (
                <div key={query._id} className={`flex ${alignment}`}>
                  <div
                    className={`relative max-w-[90%] sm:max-w-[75%] md:max-w-[60%] p-6 rounded-2xl border border-green-300 shadow-2xl transition hover:shadow-green-400/60 hover:scale-[1.02] ${bubbleColor}`}
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(query._id)}
                    >
                      <div className={`w-full ${textAlign}`}>
                        <p className="text-lg font-bold text-green-900 tracking-wide">
                          {query.question || "Untitled Query"}
                        </p>
                      </div>
                      <div className="ml-3 flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteQuery(query._id);
                          }}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition"
                          title="Delete this query"
                        >
                          <FaTrash />
                        </button>
                        {expandedId === query._id ? (
                          <FaChevronUp className="text-green-700" />
                        ) : (
                          <FaChevronDown className="text-green-700" />
                        )}
                      </div>
                    </div>

                    {expandedId === query._id && (
                      <div className={`mt-4 text-sm ${textAlign} text-green-900 space-y-2`}>
                        <p>
                          <strong>🌱 Question:</strong> {query.question}
                        </p>
                        <p>
                          <strong>🎯 Intent:</strong> {query.intent || "N/A"}
                        </p>
                        <p>
                          <strong>💬 Response:</strong> {query.response || "N/A"}
                        </p>
                        <p>
                          <strong>📅 Date:</strong>{" "}
                          {moment(query.createdAt).format("MMMM Do YYYY, h:mm A")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
