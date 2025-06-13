import React, { useState } from "react";
import axios from "axios";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  sentiment: number | null;
}

const ChatMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
      sentiment: null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      // Send message to AI model server for sentiment analysis using the /track endpoint
      const response = await axios.post("http://127.0.0.1:5000/track", {
        text: message,
        timestamp: new Date().toISOString(),
      });

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: response.data.response || "Message analyzed",
        sender: "ai",
        timestamp: new Date(),
        sentiment: response.data.sentiment_score || response.data.sentiment,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, there was an error processing your message.",
        sender: "ai",
        timestamp: new Date(),
        sentiment: null,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 p-3 rounded-lg ${
              msg.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            } max-w-[70%]`}
          >
            <p className="text-sm">{msg.text}</p>
            {msg.sentiment !== null && (
              <p className="text-xs mt-1">
                Sentiment: {msg.sentiment.toFixed(2)}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
