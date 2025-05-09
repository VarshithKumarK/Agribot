import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2, Plus } from "lucide-react";

const STATES = [
  "All States",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function SchemesPage() {
  const { user } = useContext(AuthContext);
  const [selectedState, setSelectedState] = useState("All States");
  const [schemes, setSchemes] = useState([]);
  const [newScheme, setNewScheme] = useState({
    title: "",
    description: "",
    applyLink: "",
    eligibility: "",
    benefits: "",
    type: "central",
    state: "",
  });

  const fetchSchemes = async () => {
    try {
      const res =
        selectedState === "All States"
          ? await axios.get("http://localhost:5000/api/schemes/central")
          : await axios.get("http://localhost:5000/api/schemes/state", {
              params: { state: selectedState },
            });
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddScheme = async () => {
    try {
      const payload = { ...newScheme };
      if (payload.type === "state") payload.state = selectedState;
      await axios.post("http://localhost:5000/api/schemes", payload);
      fetchSchemes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schemes/${id}`);
      fetchSchemes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedState]);

  return (
    <div className="p-4 md:p-8 bg-green-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl mt-15 md:text-4xl font-bold text-green-800 mb-8 text-center"
      >
        Government Schemes Portal
      </motion.h1>

      <div className="flex flex-col mt-15 md:flex-row md:items-center gap-4 mb-6">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm"
        >
          <option value="All States">Central Government Schemes</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {user?.role === "admin" && (
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <input
              className="p-2 border rounded-md"
              placeholder="Title"
              onChange={(e) =>
                setNewScheme({ ...newScheme, title: e.target.value })
              }
            />
            <input
              className="p-2 border rounded-md"
              placeholder="Description"
              onChange={(e) =>
                setNewScheme({ ...newScheme, description: e.target.value })
              }
            />
            <input
              className="p-2 border rounded-md"
              placeholder="Eligibility"
              onChange={(e) =>
                setNewScheme({ ...newScheme, eligibility: e.target.value })
              }
            />
            <input
              className="p-2 border rounded-md"
              placeholder="Benefits"
              onChange={(e) =>
                setNewScheme({ ...newScheme, benefits: e.target.value })
              }
            />
            <input
              className="p-2 border rounded-md"
              placeholder="Apply Link"
              onChange={(e) =>
                setNewScheme({ ...newScheme, applyLink: e.target.value })
              }
            />
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Scheme Type</label>
              <select
                className="p-2 border rounded-md"
                value={newScheme.type}
                onChange={(e) =>
                  setNewScheme({
                    ...newScheme,
                    type: e.target.value,
                    state: "",
                  })
                }
              >
                <option value="central">Central</option>
                <option value="state">State</option>
              </select>

              {newScheme.type === "state" && (
                <>
                  <label className="font-semibold">Select State</label>
                  <select
                    className="p-2 border rounded-md"
                    value={newScheme.state}
                    onChange={(e) =>
                      setNewScheme({ ...newScheme, state: e.target.value })
                    }
                  >
                    <option value="">-- Select State --</option>
                    {STATES.slice(1).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <button
              onClick={handleAddScheme}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Scheme
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schemes.map((scheme) => (
          <motion.div
            key={scheme._id}
            className="bg-white rounded-2xl shadow-md border p-4 hover:shadow-lg transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-green-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-900">
                {scheme.title}
              </h3>
              <p className="text-sm text-gray-800 mt-1">{scheme.description}</p>
              <p className="text-sm mt-1">
                <strong>Eligibility:</strong> {scheme.eligibility}
              </p>
              <p className="text-sm mt-1">
                <strong>Benefits:</strong> {scheme.benefits}
              </p>
              <a
                href={scheme.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-2"
              >
                Apply Now
              </a>
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(scheme._id)}
                  className="text-red-600 mt-2 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}