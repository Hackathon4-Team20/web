import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Send,
  Phone,
  Video,
  Smile,
  Globe,
  MessageSquare,
  BarChart2,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { NavLink } from "react-router-dom";
import ConversationList from "./ConversationList";
import ChatMessages from "./ChatMessages";
import SentimentAnalysis from "./SentimentAnalysis";
import { io, Socket } from "socket.io-client";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  sentiment?: {
    label: string;
  };
}

const AdminChatInterface = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io("http://localhost:3001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Admin connected to WebSocket server");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Admin connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Admin disconnected from WebSocket server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Listen for previous messages
    newSocket.on("previous-messages", (previousMessages: Message[]) => {
      console.log("Admin received previous messages:", previousMessages);
      setMessages(previousMessages);
    });

    // Listen for new messages
    newSocket.on("new-message", (message: Message) => {
      console.log("Admin received new message:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      const newMessage = {
        text: message,
        sender: "admin",
      };
      socket.emit("send-message", newMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Navigation Sidebar */}
      <div className="w-16 border-r border-border bg-[#A11858] flex flex-col items-center py-4 gap-4 z-20">
        <div className="flex flex-col items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-xl hover:bg-white/10 text-white"
          >
            <img
              src="/images/logo.png"
              alt="Website Logo"
              className="h-10 w-10"
            />
          </Button>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/10"
              } text-white`
            }
          >
            <BarChart2 className="h-6 w-6" />
          </NavLink>
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/10"
              } text-white`
            }
          >
            <MessageSquare className="h-6 w-6" />
          </NavLink>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Right Sidebar - Conversation List */}
        <div className="w-[300px] border-l border-border bg-card flex flex-col h-screen relative flex-shrink-0">
          {/* Admin Profile Header */}
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#A11858] flex items-center justify-center text-white font-semibold">
                  م
                </div>
                <div>
                  <h3 className="font-semibold text-sm">مدير</h3>
                  <p className="text-xs text-muted-foreground">
                    {isConnected ? "متصل" : "جاري الاتصال..."}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المحادثات..."
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 mb-4 flex-shrink-0">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab("solved")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "solved"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                محلولة
              </button>
              <button
                onClick={() => setActiveTab("solving")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "solving"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                قيد الحل
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              activeTab={activeTab}
              onSelectChat={setSelectedChat}
              selectedChat={selectedChat}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-screen min-w-[450px] border-l border-border flex-shrink-0 bg-background">
          {selectedChat ? (
            <ChatMessages
              messages={messages}
              messagesEndRef={messagesEndRef}
              onSendMessage={handleSendMessage}
              message={message}
              setMessage={setMessage}
              onKeyPress={handleKeyPress}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              اختر محادثة للبدء
            </div>
          )}
        </div>

        {/* Sentiment Analysis Sidebar */}
        <div className="w-[300px] border-l border-border bg-card h-screen overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">
              تحليل المشاعر
            </h2>
            <SentimentAnalysis />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatInterface;
