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
import Home from "./Pages/Home";
import Query from "./Pages/Query";
import FarmChat from "./Pages/FarmChat";
import RecommendCrop from "./Pages/RecommendCrop";
import Scheme from "./Pages/Scheme";
import Weather from "./Pages/Weather";
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
          <Route path="/query" element={<Query />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/farm-chat" element={<FarmChat />} />
          <Route path="/rec-crop" element={<RecommendCrop />} />
          <Route  path="/scheme"  element={<Scheme/>} />
          <Route path="/weather" element={<Weather/>} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
