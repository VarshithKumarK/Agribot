import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes, FaMusic } from "react-icons/fa";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  if (location.pathname === "/register" || location.pathname === "/login")
    return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-lg p-4 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link
          to="/"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center gap-2"
        >
          AgriBot AI
        </Link>

        <ul className="hidden lg:flex gap-6 items-center text-xl text-green-700  font-medium">
          <li>
            <Link to="/" className="hover:text-blue-300 transition">
              Home
            </Link>
          </li>

          <li>
            <Link to="/chatbot" className="hover:text-blue-300 transition">
              AgriBot
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/query" className="hover:text-blue-300 transition">
                  My Queries
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-300 transition">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg transition-all hover:opacity-80"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold shadow-lg transition-all hover:opacity-80"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transition-all hover:opacity-80"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown */}
        <div
          className={`fixed top-0 left-0 text-xl w-full h-screen bg-green-300 bg-opacity-90 flex flex-col justify-center items-center gap-6 text-green-700  font-semibold transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link
            to="/"
            className="hover:text-blue-300 transition "
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/chatbot"
            className="hover:text-blue-300 transition "
            onClick={() => setMenuOpen(false)}
          >
            AgriBot
          </Link>

          {user ? (
            <>
              <Link
                to="/query"
                className="hover:text-blue-300 transition "
                onClick={() => setMenuOpen(false)}
              >
                My Queries
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-teal-500"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
