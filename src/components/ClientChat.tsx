import React from "react";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  sentiment?: {
    label: string;
  };
}

interface ClientChatMessageProps {
  message: Message;
}

const ClientChatMessage: React.FC<ClientChatMessageProps> = ({ message }) => {
  return (
    <div
      key={message.id}
      className={`flex ${
        message.sender === "client" ? "justify-start" : "justify-end"
      } mb-4`}
      dir="rtl"
    >
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          message.sender === "client"
            ? message.sentiment?.label === "إيجابي"
              ? "bg-emerald-500 text-white"
              : message.sentiment?.label === "سلبي"
              ? "bg-rose-500 text-white"
              : "bg-yellow-500 text-white"
            : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ClientChatMessage;
