import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [activeTab, setActiveTab] = useState("solving");
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io("http://localhost:3000", {
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && socket && isConnected) {
      console.log("Admin sending message:", message);
      socket.emit("send-message", {
        text: message,
        sender: "admin",
      });
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
    <div className="flex h-screen bg-background overflow-hidden" dir="rtl">
      {/* Navigation Sidebar */}
      <div className="w-16 border-l border-border bg-[#A11858] flex flex-col items-center py-4 gap-4">
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

      {/* Left Sidebar - Conversation List */}
      <div className="w-80 border-l border-border bg-card flex flex-col">
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
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="البحث في المحادثات..." className="pr-10 h-9" />
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
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                ع
              </div>
              <div>
                <h3 className="font-semibold">علي محمد</h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "متصل" : "جاري الاتصال..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المحادثة"
                  className="pr-10 h-9 w-64"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "admin" ? "justify-start" : "justify-end"
              } mb-4`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "admin"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p
                  className={`text-sm ${
                    message.sender === "client" &&
                    message.sentiment?.label === "سلبي"
                      ? "text-rose-600"
                      : ""
                  }`}
                >
                  {message.text}
                </p>
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={isConnected ? "اكتب رسالة..." : "جاري الاتصال..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
                disabled={!isConnected}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                disabled={!isConnected}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Sentiment Analysis */}
      <div className="w-80 border-r border-border bg-card overflow-y-auto">
        <SentimentAnalysis />
      </div>
    </div>
  );
};

export default AdminChatInterface;
