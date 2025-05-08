import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === "/register" || location.pathname === "/login")
    return null;

  const renderAvatar = () => {
    if (user?.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
        />
      );
    } else {
      const initial = user?.username?.[0]?.toUpperCase() || "U";
      return (
        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold border-2 border-green-700">
          {initial}
        </div>
      );
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500"
        >
          AgriBot AI
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-6 items-center text-lg text-green-800 font-medium">
          {[
            ["Home", "/"],
            ["AgriBot", "/chatbot"],
            ["Crop Prediction", "/rec-crop"],
            ["Schemes", "/scheme"],
            ["Weather", "/weather"],
          ].map(([label, path]) => (
            <li key={path}>
              <Link to={path} className="hover:text-[#FF7F50] transition">
                {label}
              </Link>
            </li>
          ))}

          {user && (
            <>
              <li>
                <Link to="/query" className="hover:text-[#FF7F50] transition">
                  My Queries
                </Link>
              </li>
              <li>
                <Link to="/farm-chat" className="hover:text-[#FF7F50] transition">
                  Farm Chat
                </Link>
              </li>
              <li>
                <Link to="/profile" className="transition hover:text-[#FF7F50]">
                  {renderAvatar()}
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow hover:from-orange-600 hover:to-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {!user && (
            <>
              <li>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold shadow transition hover:scale-105"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold shadow transition hover:scale-105"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-green-800 text-2xl lg:hidden"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: menuOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-full h-screen bg-white/95 z-40 flex flex-col items-center justify-center text-xl gap-6 font-semibold text-green-800 lg:hidden shadow-md"
      >
        {[
          ["Home", "/"],
          ["AgriBot", "/chatbot"],
          ["Crop Prediction", "/rec-crop"],
          ["Schemes", "/scheme"],
          ["Weather", "/weather"],
        ].map(([label, path]) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#FF7F50] transition"
          >
            {label}
          </Link>
        ))}

        {user && (
          <>
            <Link to="/query" onClick={() => setMenuOpen(false)}>
              My Queries
            </Link>
            <Link to="/farm-chat" onClick={() => setMenuOpen(false)}>
              Farm Chat
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              {renderAvatar()}
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-red-400 to-orange-500 text-white shadow"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white shadow"
            >
              Register
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow"
            >
              Login
            </Link>
          </>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;
