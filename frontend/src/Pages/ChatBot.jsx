import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaMicrophone, FaPaperPlane, FaSpinner, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const { user } = useContext(AuthContext);

  
  const handleSendText = async (query) => {
    if (!query.trim()) return;

    const userMsg = { from: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/voice/query", {
        query,
      });
      setLoading(false);
      const botMsg = { from: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMsg]);

      if (res.data.response) {
        const utterance = new SpeechSynthesisUtterance(res.data.response);
        speechSynthesisRef.current = window.speechSynthesis;
        speechSynthesisRef.current.speak(utterance);
        setSpeaking(true);
        utterance.onend = () => {
          setSpeaking(false);
        };
      }

      if (user) {
        await axios.post(
          "http://localhost:5000/api/query/save",
          {
            question: query,
            intent: res.data.intent || "General",
            response: res.data.response,
          },
          {
            withCredentials: true,
          }
        );
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      const errorMsg = { from: "bot", text: "Oops! Something went wrong. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Oops! Something went wrong. Please try again."));
    }
  };

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let didGetResult = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      didGetResult = true;
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        handleSendText(transcript);
      } else {
        const msg = { from: "bot", text: "Voice not recorded" };
        setMessages((prev) => [...prev, msg]);
        window.speechSynthesis.speak(
          new SpeechSynthesisUtterance("Voice not recorded")
        );
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (!didGetResult) {
        const msg = { from: "bot", text: "Voice not recorded" };
        setMessages((prev) => [...prev, msg]);
        window.speechSynthesis.speak(
          new SpeechSynthesisUtterance("Voice not recorded")
        );
      }
    };

    recognition.start();
  };

  const handleStopSpeaking = () => {
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 mt-15 to-green-100 p-6 flex flex-col items-center font-sans">
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fade-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slide-in-user {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          @keyframes slide-in-bot {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }

          .animate-fade-down {
            animation: fade-down 0.5s ease-out forwards;
          }

          .animate-slide-in-user {
            animation: slide-in-user 0.3s ease-out forwards;
          }

          .animate-slide-in-bot {
            animation: slide-in-bot 0.3s ease-out forwards;
          }

          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col animate-fade-down">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center mt-15">
          🌱 AgriBot - Your Agricultural Assistant 🤖
        </h1>

        <div
          className="h-[400px] overflow-y-auto border border-green-200 rounded-lg p-4 mb-4 bg-gray-50 animate-fade-in"
          style={{
            backgroundImage: "url('/download.jpeg')", // Replace with a subtle pattern
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-3 ${
                msg.from === "user" ? "animate-slide-in-user" : "animate-slide-in-bot"
              }`}
            >
              <div
                className={`my-1 px-4 py-2 rounded-xl max-w-[80%] text-sm whitespace-pre-line shadow-md ${
                  msg.from === "user"
                    ? "bg-green-200 text-right text-green-800"
                    : "bg-green-100 border border-green-300 text-green-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-3 animate-fade-in">
              <div className="my-1 px-4 py-2 rounded-xl max-w-[80%] text-sm whitespace-pre-line shadow-md bg-gray-200 text-gray-700 flex items-center">
                <FaSpinner className="mr-2 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Ask AgriBot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText(input)}
            className="flex-1 border border-green-300 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
          />

          <button
            onClick={() => handleSendText(input)}
            className="bg-gradient-to-br from-green-400 to-lime-500 text-white px-5 py-3 rounded-full hover:from-green-500 hover:to-lime-600 shadow-md transition flex items-center justify-center disabled:opacity-50"
            disabled={loading}
          >
            <FaPaperPlane className="text-lg" />
          </button>

          <button
            onClick={handleVoiceInput}
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition duration-200 ${
              listening ? "bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
            title={listening ? "Listening..." : "Start voice input"}
            disabled={loading}
          >
            <FaMicrophone className="text-xl" />
          </button>

          {speaking && (
            <button
              onClick={handleStopSpeaking}
              className="w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg bg-red-500 hover:bg-red-600 transition duration-200 disabled:opacity-50"
              title="Stop speaking"
              disabled={loading}
            >
              <FaVolumeMute className="text-xl" />
            </button>
          )}
          {!speaking && messages.length > 0 && messages[messages.length - 1].from === 'bot' && (
            <button
              onClick={() => {
                if (messages[messages.length - 1].text) {
                  const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].text);
                  speechSynthesisRef.current = window.speechSynthesis;
                  speechSynthesisRef.current.speak(utterance);
                  setSpeaking(true);
                  utterance.onend = () => {
                    setSpeaking(false);
                  };
                }
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg bg-blue-500 hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              title="Speak last response"
              disabled={loading}
            >
              <FaVolumeUp className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 