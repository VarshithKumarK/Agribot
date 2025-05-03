import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const { user } = useContext(AuthContext);
  const handleSendText = async (query) => {
    const userMsg = { from: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await axios.post("http://localhost:5000/api/voice/query", {
        query,
      });
      const botMsg = { from: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(res.data.response)
      );
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
      console.error(err);
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

  return (
    <div className="min-h-screen  bg-green-100 p-4 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold mt-15 text-green-800 mb-4">
        AgriBot - Voice & Text Assistant
      </h1>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
        <div className="h-96 overflow-y-auto border border-green-200 rounded p-2 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 p-2 rounded-lg max-w-[75%] text-sm whitespace-pre-line ${
                msg.from === "user"
                  ? "bg-green-200 self-end"
                  : "bg-white self-start border border-green-300"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText(input)}
            className="flex-1 border border-green-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => handleSendText(input)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Send
          </button>
          <button
            onClick={handleVoiceInput}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-200 ${
              listening
                ? "bg-red-500 animate-pulse"
                : "bg-green-500 hover:bg-green-600"
            }`}
            title={listening ? "Listening..." : "Start voice input"}
          >
            🎤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
