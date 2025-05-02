import { ToastContainer } from "react-toastify";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ChatBot from "./Pages/ChatBot";
import Profile from "./Pages/Profile";
import Navbar from "./components/Navbar";
import QueryTable from "./components/QueryTable";
import Home from "./Pages/Home";
function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
